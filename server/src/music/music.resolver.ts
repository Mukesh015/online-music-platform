import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MusicService } from './music.service';
import { CreateMusicInput } from './dto/create-music.input';
import { Music } from './entities/music.entity';
import { Prisma } from '@prisma/client';
import { Req } from '@nestjs/common';

@Resolver(() => Music)
export class MusicResolver {
  constructor(private readonly musicService: MusicService) { }


  @Query(returns => [Music])
  async musics(): Promise<Partial<Music>[]> {
    return this.musicService.findAll();
  }

  @Query(returns => [Music])
  async getMusicByUserId(@Req() req:Request ): Promise<Partial<Music>[]> {
    const userId = req['firebaseUserId'];

    return this.musicService.findByUserId(userId)
  }
    
}
