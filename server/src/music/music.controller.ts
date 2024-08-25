import { Body, Controller,Post } from '@nestjs/common';
import {MusicService} from './music.service'
import { Prisma } from '@prisma/client';
@Controller('music')
export class MusicController {
    constructor(private readonly musicservice: MusicService) {}
    @Post()
    signup(@Body() createUSerDto:Prisma.UserCreateInput){
        return this.musicservice.signup(createUSerDto)
    }
}
