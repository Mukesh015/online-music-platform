import { Test, TestingModule } from '@nestjs/testing';
import { SearchbarService } from './searchbar.service';

describe('SearchbarService', () => {
  let service: SearchbarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchbarService],
    }).compile();

    service = module.get<SearchbarService>(SearchbarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
