import { Test, TestingModule } from '@nestjs/testing';
import { FertilizerService } from './fertilizer.service';

describe('FertilizerService', () => {
  let service: FertilizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FertilizerService],
    }).compile();

    service = module.get<FertilizerService>(FertilizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
