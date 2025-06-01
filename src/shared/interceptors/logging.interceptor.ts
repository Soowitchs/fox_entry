import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    if (!httpContext) {
      return next.handle();
    }

    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          console.log(
            `[LoggingInterceptor] ${method} ${url} ${response.statusCode} - ${responseTime}ms`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          console.log(
            `[LoggingInterceptor] ${method} ${url} Error - ${responseTime}ms`,
          );
          console.error(error);
        },
      }),
    );
  }
}
