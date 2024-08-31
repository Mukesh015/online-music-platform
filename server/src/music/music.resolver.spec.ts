import { Test, TestingModule } from '@nestjs/testing';
import { MusicResolver } from './music.resolver';
import { MusicService } from './music.service';

describe('MusicResolver', () => {
  let resolver: MusicResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicResolver, MusicService],
    }).compile();

    resolver = module.get<MusicResolver>(MusicResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
