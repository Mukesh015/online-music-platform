import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
// import { CreateMusicInput } from './dto/create-music.input';
import { Prisma } from '@prisma/client';
import { Music, Playlist } from './entities/music.entity'

const ytdlp = require('yt-dlp-exec');

import { Readable } from 'stream';

@Injectable()
export class MusicService {
  constructor(private readonly dbService: DatabaseService) { }

  // async findOne(id: number): Promise<Music | null> {
  //   return this.dbService.music.findUnique({ where: { id } });
  // }


  async upload(createMusicDto: Prisma.MusicCreateInput, userId: string) {
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
            musicUrl: createMusicDto.musicUrl,
          },
        },
      });

      if (musicExists) {
        return { message: "Music with this URL already exists for this user", statusCode: 409 };
      }



      const newMusic = await this.dbService.music.create({
        data: {
          userId,
          musicUrl: createMusicDto.musicUrl,
          musicTitle: createMusicDto.musicTitle,
          musicArtist: createMusicDto.musicArtist,
          thumbnailUrl: createMusicDto.thumbnailUrl,
        },
      });

      return { message: "Music uploaded successfully", statusCode: 201, newMusic: newMusic };

    } catch (error) {

      console.error("Error uploading music:", error);


      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { message: "Music with this URL already exists", statusCode: 409 };
        }

      }

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
        return { message: "Music removed successfully", statusCode: 200, musicDetails: musicEntry };
      } else {

        return { message: "You cannot delete this music", statusCode: 403, musicDetails: musicEntry };
      }
    } catch (error) {

      console.error("Error removing music:", error);
      return { message: "An error occurred while removing music", statusCode: 500, error: error.message };
    }

  }


  async addToFavorite(id: number, userId: string) {
    try {

      const music = await this.dbService.music.findUnique({
        where: { id },
      });
      if (!music) {
        return { message: "Music not found", statusCode: 404, musicDetails: music };
      }


      const existingFavorite = await this.dbService.isFavourite.findUnique({
        where: { userId_id: { userId, id: id } },
      });

      if (existingFavorite) {

        await this.dbService.isFavourite.update({
          where: { userId_id: { userId, id } },
          data: { isFavourite: !existingFavorite.isFavourite },
        });
        return {
          message: existingFavorite.isFavourite ? "Music removed from favorites" : "Music added to favorites",
          statusCode: 200,
          musicDetails: music,
        };
      } else {

        await this.dbService.isFavourite.create({
          data: {
            userId,
            id,
            isFavourite: true,
          },
        });
        return {
          message: "Music added to favorites",
          statusCode: 200,
          musicDetails: music,
        };
      }
    } catch (error) {
      console.error("Error adding music to favorites:", error);
      return {
        message: "An error occurred while adding music to favorites",
        statusCode: 500,
        error: error.message,
      };
    }
  }





  async addToPlaylist(userId: string, addtoPlaylistDto: Prisma.PlaylistCreateInput) {
    const { musicId, playlistName } = addtoPlaylistDto

    try {
      const music = await this.dbService.music.findUnique({
        where: { id: musicId },
      });
      if (!music) {
        return { message: "Music not found", statusCode: 404, playlistName: musicId };
      }

      const existingPlaylist = await this.dbService.playlist.findUnique({
        where: {
          userId_musicId: {
            userId: userId,
            musicId,
          }
        }
      });

      if (existingPlaylist) {
        return { message: 'Playlist name already exists', statusCode: 409, playlistName: playlistName };
      }


      const newPlaylist = await this.dbService.playlist.create({
        data: {
          userId: userId,
          playlistName,
          musicId,
        }
      });

      return { mesge: 'Playlist created successfully', statusCode: 201, playlistName: newPlaylist };

    } catch (error) {
      console.error('Error creating playlist:', error);
      return { message: 'Error creating playlist', statusCode: 500, error: error.message }
    }
  }


  async updatePlaylist(updateplayListDto: Prisma.PlaylistUpdateInput, userId: string) {
    const musicId = updateplayListDto.musicId as number
    const playlistName = updateplayListDto.playlistName as string

    try {
      const music = await this.dbService.music.findUnique({
        where: { id: musicId },
      });

      if (!music) {
        return { message: "Music not found", statusCode: 404, updatedPlaylist: musicId };
      }

      const playlist = await this.dbService.playlist.findFirst({
        where: {
          userId,
          playlistName,
        },
      });

      if (playlist) {
        const existingMusicInPlaylist = await this.dbService.playlist.findFirst({
          where: {
            userId,
            playlistName,
            musicId,
          },
        });

        if (existingMusicInPlaylist) {
          console.log('Music already exists in the playlist');
          return { message: "Music already exists in the playlist", statusCode: 409, updatedPlaylist: playlist };
        }

        await this.dbService.playlist.create({
          data: {
            userId,
            musicId,
            playlistName,
          },
        });

        return { message: "Music added to the playlist", statusCode: 200, updatedPlaylist: playlist };
      } else {
        return { message: "Playlist not found", statusCode: 404, updatedPlaylist: musicId };
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
      return { message: "Internal server error", statusCode: 500, error: error.message };
    }

  }

  async findAll(userId: string): Promise<Partial<Music>[]> {
    if (userId === "null" || userId === "invalid") {

      const musicList = await this.dbService.music.findMany({
        select: {
          id: true,
          musicUrl: true,
          thumbnailUrl: true,
          musicTitle: true,
          musicArtist: true,
          createdAt: true,
        },
      });

      return musicList.map(music => ({
        ...music,
        isFavourite: 'false',
      }));
    } else {

      const musicList = await this.dbService.music.findMany({
        select: {
          id: true,
          musicUrl: true,
          thumbnailUrl: true,
          musicTitle: true,
          musicArtist: true,
          createdAt: true,
        },
      });


      const favourites = await this.dbService.isFavourite.findMany({
        where: {
          userId: userId,
          id: { in: musicList.map(music => music.id) },
        },
      });


      const favouritesMap = new Map<number, string>(
        favourites.map(fav => [fav.id, fav.isFavourite.toString()])
      );


      return musicList.map(music => ({
        ...music,
        isFavourite: favouritesMap.get(music.id) ?? 'false',
      }));
    }
  }





  async findByUserId(userId: string): Promise<Partial<Music>[]> {

    const musicList = await this.dbService.music.findMany({
      where: { userId },
      select: {
        id: true,
        musicUrl: true,
        thumbnailUrl: true,
        musicTitle: true,
        musicArtist: true,
        createdAt: true,
      },
    });


    const favourites = await this.dbService.isFavourite.findMany({
      where: {
        userId,
        id: { in: musicList.map(music => music.id) },
      },
    });

    const favouritesMap = new Map<number, string>(
      favourites.map(fav => [fav.id, fav.isFavourite.toString()])
    );


    return musicList.map(music => ({
      ...music,
      isFavourite: favouritesMap.get(music.id) ?? 'false',
    }));
  }


  async findFouriteByUserId(userId: string): Promise<Partial<Music>[]> {

    const favouriteIds = await this.dbService.isFavourite.findMany({
      where: { userId },
      select: { id: true },
    });


    const ids = favouriteIds.map(fav => fav.id);


    const musicList = await this.dbService.music.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        musicUrl: true,
        thumbnailUrl: true,
        musicTitle: true,
        musicArtist: true,
        createdAt: true,

      },
    });


    return musicList;
  }
  async getPlaylistNameByUserId(userId: string): Promise<string[]> {
    try {
      // Fetch all playlist names for the given userId
      const playlists = await this.dbService.playlist.findMany({
        where: { userId },
        select: { playlistName: true },
      });

      // Extract playlist names and remove duplicates
      const playlistNames = playlists.map(p => p.playlistName);
      const distinctPlaylistNames = Array.from(new Set(playlistNames));

      return distinctPlaylistNames;
    } catch (error) {
      console.error('Error fetching playlist names:', error);
      throw new Error('Unable to fetch playlist names');
    }
  }


  async getPlaylistByUserId(userId: string): Promise<Partial<Playlist>[]> {
    const playlists = await this.dbService.playlist.findMany({
      where: { userId },
      include: {
        Music: {
          select: {
            id: true,
            musicUrl: true,
            thumbnailUrl: true,
            musicTitle: true,
            musicArtist: true,
            createdAt: true,
          },
        },
      },
    });


    const playlistMap = new Map<string, Playlist>();

    playlists.forEach(playlist => {
      const { playlistName, Music } = playlist;


      const musicArray = Array.isArray(Music) ? Music : [Music];


      if (!playlistMap.has(playlistName)) {
        playlistMap.set(playlistName, {
          playlistName,
          playlists: [],
        });
      }

      playlistMap.get(playlistName)!.playlists.push(...musicArray.map(m => ({
        id: m.id,
        musicUrl: m.musicUrl,
        thumbnailUrl: m.thumbnailUrl,
        musicTitle: m.musicTitle,
        musicArtist: m.musicArtist,
        createdAt: m.createdAt,
        isFavourite: m.isFavourite,
      })));
    });

    return Array.from(playlistMap.values());
  }

  async getMp3Stream(youtubeUrl: string): Promise<Readable> {
    try {
      const result = await ytdlp(youtubeUrl, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: 'audio.mp3',

      });
      console.log("Download process started", result);
      return result.stdout;
    } catch (error) {
      console.error('Error downloading or processing audio:', error);
      throw error;
    }
  }


}

