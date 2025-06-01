import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { MonitoringInterceptor } from './monitoring.interceptor';
import { PrometheusService } from '../monitoring/prometheus.service';

describe('MonitoringInterceptor', () => {
  let interceptor: MonitoringInterceptor;
  let mockPrometheusService: jest.Mocked<PrometheusService>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    mockPrometheusService = {
      incrementHttpRequests: jest.fn(),
      observeHttpRequestDuration: jest.fn(),
    } as any;

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          path: '/test',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as any;

    mockCallHandler = {
      handle: () => of({ data: 'test' }),
    };

    interceptor = new MonitoringInterceptor(mockPrometheusService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should increment request counter on successful response', (done) => {
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response) => {
        expect(response).toEqual({ data: 'test' });
        expect(
          mockPrometheusService.incrementHttpRequests,
        ).toHaveBeenCalledWith('GET', '/test', 200);
        expect(
          mockPrometheusService.observeHttpRequestDuration,
        ).toHaveBeenCalledWith('GET', '/test', expect.any(Number));
        done();
      },
    });
  }, 10000);

  it('should increment request counter on error response', (done) => {
    const error = new Error('Test error');
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(
          mockPrometheusService.incrementHttpRequests,
        ).toHaveBeenCalledWith('GET', '/test', 500);
        expect(
          mockPrometheusService.observeHttpRequestDuration,
        ).toHaveBeenCalledWith('GET', '/test', expect.any(Number));
        done();
      },
    });
  }, 10000);

  it('should handle non-HTTP context', () => {
    mockExecutionContext = {
      switchToHttp: () => null,
    } as any;

    const result = interceptor.intercept(mockExecutionContext, mockCallHandler);
    expect(result).toBeDefined();
  });
});
