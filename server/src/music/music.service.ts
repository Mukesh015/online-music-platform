import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
// import { Prisma } from '@prisma/client';
import { Prisma } from 'prisma/generated/client';


@Injectable()
export class MusicService {
    constructor(private readonly dbService: DatabaseService) { }


    async upload(updateMusicDtos: Prisma.MusicCreateInput, userId: string) {

        const userExists = await this.dbService.user.findUnique({
            where: { userId },
        });

        if (userExists) {
            
            const musicExists = await this.dbService.music.findUnique({
                where: {
                    userId_url: {
                        userId,
                        url: updateMusicDtos.url,
                    },
                },
            });

            if (!musicExists) {
      
                const newMusic = await this.dbService.music.create({
                    data: {
                        userId, 
                        url: updateMusicDtos.url,
                        title: updateMusicDtos.title,
                        
                        duration: updateMusicDtos.duration,
                    },
                });
                return newMusic; 
            } else {
                throw new Error("Music with this URL already exists for this user");
            }
        } else {
            throw new Error("User does not exist");
        }
    }
}


