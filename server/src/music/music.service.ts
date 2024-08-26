import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, User, Music } from '@prisma/client';

@Injectable()
export class MusicService {
    constructor(private readonly dbService: DatabaseService) { }

    async signup(createUserDto: Prisma.UserCreateInput) {
        const { userId } = createUserDto;

        const existingUser = await this.dbService.user.findUnique({
            where: { userId },
        });

        if (existingUser) {
            return { status: 0, message: "User already exists" };
        }

        try {
            await this.dbService.user.create({
                data: createUserDto,
            });
            return { status: 1, message: "User created successfully" };
        } catch (error) {
            throw new ConflictException('Failed to create user');
        }
    }
    async upload(updateMusicDtos: Prisma.MusicCreateInput, userId: string) {
        // Check if the user exists in the User table
        const userExists = await this.dbService.user.findUnique({
            where: { userId },
        });

        if (userExists) {
            // Check if the music with the same url and userId already exists
            const musicExists = await this.dbService.music.findUnique({
                where: {
                    userId_url: {
                        userId,
                        url: updateMusicDtos.url,
                    },
                },
            });

            if (!musicExists) {
                // Create a new music record if the user exists and the music doesn't already exist
                const newMusic = await this.dbService.music.create({
                    data: {
                        userId, // Set the userId
                        url: updateMusicDtos.url,
                        title: updateMusicDtos.title,
                        
                        duration: updateMusicDtos.duration,
                    },
                });
                return newMusic; // Return the newly created music object
            } else {
                throw new Error("Music with this URL already exists for this user");
            }
        } else {
            throw new Error("User does not exist");
        }
    }
}


