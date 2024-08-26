import { Body, Controller, Patch, Req,Post } from '@nestjs/common';
import { Request } from 'express';
import { MusicService } from './music.service';
import { Prisma } from '@prisma/client';

@Controller('music')
export class MusicController {
  constructor(private readonly musicservice: MusicService) {}

  @Post()
  signup(@Body() createUSerDto: Prisma.UserCreateInput) {
    return this.musicservice.signup(createUSerDto);
  }

  @Patch()
  upload(@Body() updateMusicDto: Prisma.MusicCreateInput, @Req() req: Request) {
    const userId = req['firebaseUserId'];
    console.log('Authenticated user ID:', userId);
    return this.musicservice.upload(updateMusicDto,userId);
  }
}
