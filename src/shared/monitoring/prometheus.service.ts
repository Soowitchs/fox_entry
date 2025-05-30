import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDuration: Histogram;

  constructor(private readonly registry: Registry) {
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
  }

  incrementHttpRequests(method: string, path: string, status: number) {
    this.httpRequestsTotal.inc({ method, path, status });
  }

  observeHttpRequestDuration(method: string, path: string, duration: number) {
    this.httpRequestDuration.observe({ method, path }, duration);
  }
} 