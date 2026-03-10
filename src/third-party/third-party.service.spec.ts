import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartyService } from './third-party.service';

describe('ThirdPartyService', () => {
  let service: ThirdPartyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThirdPartyService],
    }).compile();

    service = module.get<ThirdPartyService>(ThirdPartyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return mock data for a given endpoint', async () => {
      const result = await service.getData('/users');

      expect(result).toHaveProperty('source', 'third-party-api');
      expect(result).toHaveProperty('endpoint', '/users');
      expect(result.data).toHaveProperty('status', 'ok');
      expect(result.data).toHaveProperty('timestamp');
    });

    it('should return different endpoints correctly', async () => {
      const result = await service.getData('/products');

      expect(result.endpoint).toBe('/products');
    });
  });

  describe('postData', () => {
    it('should return mock created response', async () => {
      const body = { name: 'test', value: 42 };
      const result = await service.postData('/items', body);

      expect(result).toHaveProperty('source', 'third-party-api');
      expect(result).toHaveProperty('endpoint', '/items');
      expect(result.data).toHaveProperty('status', 'created');
      expect(result.data).toHaveProperty('received', body);
      expect(result.data).toHaveProperty('timestamp');
    });
  });
});
