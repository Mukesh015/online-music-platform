import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MusicService } from './music.service';
import { CreateMusicInput } from './dto/create-music.input';
import { Music } from './entities/music.entity';
import { Prisma } from '@prisma/client';

@Resolver(() => Music)
export class MusicResolver {
  constructor(private readonly musicService: MusicService) {}

  @Mutation(() => Music)
  async createMusic(
    @Args('createMusicInput') createMusicInput: CreateMusicInput,
  ): Promise<Music> {
    const userId="vsfdtn"
    return this.musicService.create(createMusicInput,userId);
  }

  @Query(returns => [Music])
  async musics(): Promise<Music[]> {
    return this.musicService.findAll();
  }
}
