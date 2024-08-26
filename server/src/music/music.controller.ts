import { Body, Controller,Patch,Post } from '@nestjs/common';
import {MusicService} from './music.service'
import { Prisma } from '@prisma/client';
@Controller('music')
export class MusicController {
    constructor(private readonly musicservice: MusicService) {}
    @Post()
    signup(@Body() createUSerDto:Prisma.UserCreateInput){
        return this.musicservice.signup(createUSerDto)
    }
    @Patch()
    upload(@Body() updateMusicDto:Prisma.MusicUpdateInput){
        return this.musicservice.upload(updateMusicDto)
    }
}
