import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { MusicService } from './music.service';

import { Music,Playlist} from './entities/music.entity';

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
    if (userId === "null" || userId === "invalid") {
      return [];
    }
    return this.musicService.findByUserId(userId)
  }


  @Query(returns => [Music])
  @UseGuards(AuthGuard)
  async getFavoriteMusicByUserId(@Context() context): Promise<Partial<Music>[]> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null" || userId === "invalid") {
      return [];
    }
    return this.musicService.findFouriteByUserId(userId)

  }
  @Query(returns => [String])
  @UseGuards(AuthGuard)
  async getPlaylistNameByUserId(@Context() context): Promise<string[]> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null" || userId === "invalid") {
      return [];
    }
    return this.musicService.getPlaylistNameByUserId(userId)

  }

  @Query(returns => [Playlist])
  @UseGuards(AuthGuard)
  async getPlaylistByUserId(@Context() context): Promise<Partial<Playlist>[]> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null" || userId === "invalid") {
      return [];
    }
    return this.musicService.getPlaylistByUserId(userId)
  }



}


