import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrometheusService } from '../monitoring/prometheus.service';

interface RequestWithMethodAndPath {
  method: string;
  path: string;
}

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    if (!httpContext) {
      return next.handle();
    }

    const request = httpContext.getRequest<RequestWithMethodAndPath>();
    const { method, path } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = (Date.now() - startTime) / 1000;
          this.prometheusService.incrementHttpRequests(method, path, 200);
          this.prometheusService.observeHttpRequestDuration(
            method,
            path,
            duration,
          );
        },
        error: (error) => {
          const duration = (Date.now() - startTime) / 1000;
          const statusCode = error.status || 500;
          this.prometheusService.incrementHttpRequests(
            method,
            path,
            statusCode,
          );
          this.prometheusService.observeHttpRequestDuration(
            method,
            path,
            duration,
          );
        },
      }),
    );
  }
}
