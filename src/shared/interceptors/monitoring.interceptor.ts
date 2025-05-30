import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrometheusService } from '../monitoring/prometheus.service';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = (Date.now() - startTime) / 1000;
          
          this.prometheusService.incrementHttpRequests(
            method,
            path,
            response.statusCode,
          );
          this.prometheusService.observeHttpRequestDuration(
            method,
            path,
            duration,
          );
        },
        error: (error) => {
          const duration = (Date.now() - startTime) / 1000;
          
          this.prometheusService.incrementHttpRequests(
            method,
            path,
            error.status || 500,
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