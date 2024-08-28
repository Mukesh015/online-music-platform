import { Body, Controller, Patch, Req,Post, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { Request } from 'express';
import { MusicService } from './music.service';
import { Prisma } from '@prisma/client';




@Controller('music')
export class MusicController {
  constructor(private readonly musicservice: MusicService) {}

  @Post()
  upload(@Body() createMusicDto: Prisma.MusicCreateInput, @Req() req: Request) {
    const userId = req['firebaseUserId'];
   
    return this.musicservice.upload(createMusicDto,userId);
  }
  @Patch(':id')
  edit(@Param('id',ParseIntPipe) id:number ,updateMusicDto: Prisma.MusicUpdateInput,@Req() req: Request){
    const userId = req['firebaseUserId'];
    return this.musicservice.update(updateMusicDto,userId,id);
  }

  @Delete(':id')
  delete(@Param('id',ParseIntPipe) id:number,@Req() req: Request) {
    const userId = req['firebaseUserId'];
    return this.musicservice.remove(id,userId);
  }
}
