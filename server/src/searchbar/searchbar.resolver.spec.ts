import { Test, TestingModule } from '@nestjs/testing';
import { SearchbarResolver } from './searchbar.resolver';

describe('SearchbarResolver', () => {
  let resolver: SearchbarResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchbarResolver],
    }).compile();

    resolver = module.get<SearchbarResolver>(SearchbarResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
