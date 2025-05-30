import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { MonitoringInterceptor } from './interceptors/monitoring.interceptor';
import { PrometheusService } from './monitoring/prometheus.service';
import { Registry } from 'prom-client';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MonitoringInterceptor,
    },
    {
      provide: Registry,
      useValue: new Registry(),
    },
    PrometheusService,
  ],
  exports: [PrometheusService],
})
export class SharedModule {} 