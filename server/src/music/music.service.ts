import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
// import { Prisma } from '../../prisma/generated/client';


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

    async update(updateMusicDtos: Prisma.MusicUpdateInput, userId: string, musicId: number) {
        try {

            const musicEntry = await this.dbService.music.findUnique({
                where: { id: musicId },
            });

            if (!musicEntry) {
                return { message: "Music not found", statusCode: 404 };
            }


            if (musicEntry.userId === userId) {

                const updatedMusic = await this.dbService.music.update({
                    where: { id: musicId },
                    data: updateMusicDtos,
                });
                return { message: "Music updated successfully", statusCode: 200, updatedMusic: updatedMusic };
            } else {

                return { message: "You cannot update this music", statusCode: 403, musicDetails: updateMusicDtos };
            }
        } catch (error) {

            console.error("Error updating music:", error);
            return { message: "An error occurred while updating music", statusCode: 500, error: error.message };
        }

    }
    async remove(musicId: number, userId: string) {
        try {
            // Find the music entry by its ID
            const musicEntry = await this.dbService.music.findUnique({
                where: { id: musicId },
            });
    
            // Check if the music entry exists
            if (!musicEntry) {
                return { message: "Music not found", statusCode: 404 };
            }
    
            // Check if the user ID matches
            if (musicEntry.userId === userId) {
                // Proceed with the deletion
                await this.dbService.music.delete({
                    where: { id: musicId },
                });
                return { message: "Music removed successfully", statusCode: 200 };
            } else {
                // User is not authorized to delete this music
                return { message: "You cannot delete this music", statusCode: 403 };
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("Error removing music:", error);
            return { message: "An error occurred while removing music", statusCode: 500, error: error.message };
        }

    }
}


