import { Test, TestingModule } from '@nestjs/testing';
import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle HttpException', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockHost = {
        switchToHttp: () => ({
          getResponse: () => mockResponse as any,
          getRequest: () => ({}) as any,
          getNext: () => jest.fn() as any,
        }),
        switchToRpc: () => ({
          getData: () => ({}) as any,
          getContext: () => ({}) as any,
        }),
        switchToWs: () => ({
          getData: () => ({}) as any,
          getClient: () => ({}) as any,
          getPattern: () => '' as any,
        }),
        getArgs: () => [] as any,
        getArgByIndex: () => ({}) as any,
        getType: () => 'http' as any,
      } as ArgumentsHost;

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error',
        error: 'Error',
        timestamp: expect.any(String),
        path: undefined,
      });
    });

    it('should handle non-HttpException', () => {
      const exception = new Error('Test error');
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockHost = {
        switchToHttp: () => ({
          getResponse: () => mockResponse as any,
          getRequest: () => ({}) as any,
          getNext: () => jest.fn() as any,
        }),
        switchToRpc: () => ({
          getData: () => ({}) as any,
          getContext: () => ({}) as any,
        }),
        switchToWs: () => ({
          getData: () => ({}) as any,
          getClient: () => ({}) as any,
          getPattern: () => '' as any,
        }),
        getArgs: () => [] as any,
        getArgByIndex: () => ({}) as any,
        getType: () => 'http' as any,
      } as ArgumentsHost;

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Error',
        timestamp: expect.any(String),
        path: undefined,
      });
    });
  });
});
