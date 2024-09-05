import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { MusicService } from './music.service';
import { CreateMusicInput } from './dto/create-music.input';
import { Music } from './entities/music.entity';
import { Prisma } from '@prisma/client';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authguard/authguard.service'

@Resolver(() => Music)
export class MusicResolver {
  constructor(private readonly musicService: MusicService) { }


  @Query(returns => [Music])
  @UseGuards(AuthGuard)
  async musics(@Context() context): Promise<Partial<Music>[]> {
    const userId = context.req['firebaseUserId'];
    return this.musicService.findAll(userId);
  }

  @Query(returns => [Music])
  @UseGuards(AuthGuard)
  async getMusicByUserId(@Context() context): Promise<Partial<Music>[]> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null"||userId === "invalid") {
      return [];
    }
   return this.musicService.findByUserId(userId)
  }


  @Query(returns => [Music])
  @UseGuards(AuthGuard)
  async getFavoriteMusicByUserId(@Context() context): Promise<Partial<Music>[]> {
    const userId = context.req['firebaseUserId'];

    if (userId === "null"||userId === "invalid") {
      return [];
    }
    return this.musicService.findFouriteByUserId(userId)

  }

}


