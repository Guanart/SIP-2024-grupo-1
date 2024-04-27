import { Test, TestingModule } from '@nestjs/testing';
import { FundraisingService } from '../../src/fundraising/fundraising.service';

describe('FundraisingService', () => {
  let service: FundraisingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundraisingService],
    }).compile();

    service = module.get<FundraisingService>(FundraisingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
