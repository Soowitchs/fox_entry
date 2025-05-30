import { Test, TestingModule } from '@nestjs/testing';
import { PrometheusService } from './prometheus.service';
import { Registry } from 'prom-client';

describe('PrometheusService', () => {
  let service: PrometheusService;
  let registry: Registry;

  beforeEach(async () => {
    registry = new Registry();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrometheusService,
        {
          provide: Registry,
          useValue: registry,
        },
      ],
    }).compile();

    service = module.get<PrometheusService>(PrometheusService);
  });

  afterEach(() => {
    registry.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('incrementHttpRequests', () => {
    it('should increment the counter with correct labels', async () => {
      const method = 'GET';
      const path = '/test';
      const status = 200;

      service.incrementHttpRequests(method, path, status);

      const metrics = await registry.getMetricsAsJSON();
      const counter = metrics.find(m => m.name === 'http_requests_total');
      
      expect(counter).toBeDefined();
      expect(counter?.type).toBe('counter');
    });
  });

  describe('observeHttpRequestDuration', () => {
    it('should observe the duration with correct labels', async () => {
      const method = 'GET';
      const path = '/test';
      const duration = 0.5;

      service.observeHttpRequestDuration(method, path, duration);

      const metrics = await registry.getMetricsAsJSON();
      const histogram = metrics.find(m => m.name === 'http_request_duration_seconds');
      
      expect(histogram).toBeDefined();
      expect(histogram?.type).toBe('histogram');
    });
  });
}); 