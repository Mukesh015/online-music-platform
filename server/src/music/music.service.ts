import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMusicInput } from './dto/create-music.input';
import { Prisma, Music } from '@prisma/client';

@Injectable()
export class MusicService {
  constructor(private readonly dbService: DatabaseService) { }

  async findOne(id: number): Promise<Music | null> {
    return this.dbService.music.findUnique({ where: { id } });
  }

  async findAll(): Promise<Music[]> {
    return this.dbService.music.findMany();
  }

  async create(createMusicInput: CreateMusicInput, userId: string): Promise<Music> {
    return this.dbService.music.create({
      data: {
        ...createMusicInput,
        userId,
      },
    });
  }
  async upload(updateMusicDtos: Prisma.MusicCreateInput, userId: string) {
    try {

      const userExists = await this.dbService.user.findUnique({
        where: { userId },
      });

      if (!userExists) {
        return { message: "User does not exist", statusCode: 404 };
      }


      const musicExists = await this.dbService.music.findUnique({
        where: {
          userId_musicUrl: {
            userId,
            musicUrl: updateMusicDtos.musicUrl,
          },
        },
      });

      if (musicExists) {
        return { message: "Music with this URL already exists for this user", statusCode: 409 };
      }

      if (!updateMusicDtos ||
        updateMusicDtos.musicUrl ||
        updateMusicDtos.musicTitle ||
        updateMusicDtos.musicArtist ||
        updateMusicDtos.thumbnailUrl) {
        return { message: "Missing required fields", statusCode: 400 };
      }

      const newMusic = await this.dbService.music.create({
        data: {
          userId,
          musicUrl: updateMusicDtos.musicUrl,
          musicTitle: updateMusicDtos.musicTitle,
          musicArtist: updateMusicDtos.musicArtist,
          thumbnailUrl: updateMusicDtos.thumbnailUrl
        },
      });

      return { message: "Music uploaded successfully", statusCode: 201, newMusic: newMusic };

    } catch (error) {

      console.error("Error uploading music:", error);
      return { message: "An error occurred while uploading music", statusCode: 500, error: error.message };
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

      const musicEntry = await this.dbService.music.findUnique({
        where: { id: musicId },
      });


      if (!musicEntry) {
        return { message: "Music not found", statusCode: 404 };
      }


      if (musicEntry.userId === userId) {

        await this.dbService.music.delete({
          where: { id: musicId },
        });
        return { message: "Music removed successfully", statusCode: 200 };
      } else {

        return { message: "You cannot delete this music", statusCode: 403 };
      }
    } catch (error) {

      console.error("Error removing music:", error);
      return { message: "An error occurred while removing music", statusCode: 500, error: error.message };
    }

  }

}
