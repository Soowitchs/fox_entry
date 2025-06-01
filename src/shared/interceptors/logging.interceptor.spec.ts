import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as any;

    mockCallHandler = {
      handle: () => of({ data: 'test' }),
    };

    interceptor = new LoggingInterceptor();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response', (done) => {
    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (response) => {
        expect(response).toEqual({ data: 'test' });
        try {
          expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('[LoggingInterceptor] GET /test 200'),
          );
        } catch (e) {
          // Print actual calls for debugging

          console.log('Actual console.log calls:', consoleSpy.mock.calls);
          throw e;
        }
        done();
      },
    });
  }, 10000);

  it('should handle errors', (done) => {
    const error = new Error('Test error');
    mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('[LoggingInterceptor] GET /test Error'),
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
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
