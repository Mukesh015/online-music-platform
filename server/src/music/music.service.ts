import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
// import { CreateMusicInput } from './dto/create-music.input';
import { Prisma } from '@prisma/client';
import { Music, Playlist, AddToPlaylistDto, removeFromPlaylistDto, renamePlaylistDto } from './entities/music.entity'



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



        const lastHistoryEntry = await this.dbService.lasthistory.findUnique({
          where: { userId: userId },
        });


        if (lastHistoryEntry && lastHistoryEntry.musicId === musicId) {

          const previousMusic = await this.dbService.music.findFirst({
            where: { userId: userId, NOT: { id: musicId } },
            orderBy: { createdAt: 'desc' },
          });

          if (previousMusic) {
            await this.dbService.lasthistory.update({
              where: { userId: userId },
              data: {
                musicId: previousMusic.id,
                musicUrl: previousMusic.musicUrl,
                thumbnailUrl: previousMusic.thumbnailUrl,
                musicTitle: previousMusic.musicTitle,
                musicArtist: previousMusic.musicArtist,
                lastPlayedAt: new Date(),
              },
            });
          } else {

            await this.dbService.lasthistory.delete({
              where: { userId: userId },
            });
          }
        }

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
          statusCode: existingFavorite.isFavourite ? 200 : 201,
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





  async addToPlaylist(userId: string, addToPlaylistDto: AddToPlaylistDto) {
    const { musicIds, playlistName } = addToPlaylistDto;

    try {
      const notFoundMusicIds: number[] = [];
      const alreadyInPlaylistMusicIds: number[] = [];
      const addedMusicIds: number[] = [];

      const musicRecords = await this.dbService.music.findMany({
        where: {
          id: {
            in: musicIds,
          },
        },
      });

      const musicIdSet = new Set(musicRecords.map(m => m.id));

      // Step 2: Determine which musicIds are valid
      for (const musicId of musicIds) {
        if (!musicIdSet.has(musicId)) {
          notFoundMusicIds.push(musicId);
        }
      }

      // Step 3: Check which music is already in the playlist
      const existingPlaylistItems = await this.dbService.playlist.findMany({
        where: {
          userId,
          playlistName,
          musicId: {
            in: musicIds,
          },
        },
      });

      const existingMusicIdSet = new Set(existingPlaylistItems.map(p => p.musicId));

      for (const musicId of musicIds) {
        if (notFoundMusicIds.includes(musicId)) {
          continue;
        }

        if (existingMusicIdSet.has(musicId)) {
          alreadyInPlaylistMusicIds.push(musicId);
        } else {
          addedMusicIds.push(musicId);
        }
      }


      if (addedMusicIds.length > 0) {
        await this.dbService.$transaction(async (prisma) => {
          const playlistEntries = addedMusicIds.map(musicId => ({
            userId,
            musicId,
            playlistName,
          }));

          await prisma.playlist.createMany({
            data: playlistEntries,
          });
        });
      }


      return {
        statusCode: 200,
        message: "Playlist updated successfully",
        playlistDetails: {
          added: addedMusicIds,
          alreadyExists: alreadyInPlaylistMusicIds,
          notFound: notFoundMusicIds,
        },
      };
    } catch (error) {
      console.error('Error adding to playlist:', error);
      return {
        message: 'Error adding to playlist',
        statusCode: 500,
        error: error.message,
      };
    }
  }


  async updatePlaylist(updateplayListDto: AddToPlaylistDto, userId: string) {
    const { musicIds, playlistName } = updateplayListDto;

    try {

      const playlist = await this.dbService.playlist.findFirst({
        where: {
          userId,
          playlistName,
        },
      });

      if (!playlist) {
        return { message: "Playlist not found", statusCode: 404, updatedPlaylist: null };
      }

      const notFoundMusicIds = [];
      const alreadyInPlaylistMusicIds = [];
      const addedMusicIds = [];

      for (const musicId of musicIds) {

        const music = await this.dbService.music.findUnique({
          where: { id: musicId },
        });

        if (!music) {
          notFoundMusicIds.push(musicId);
          continue;
        }


        const existingMusicInPlaylist = await this.dbService.playlist.findFirst({
          where: {
            userId,
            playlistName,
            musicId,
          },
        });

        if (existingMusicInPlaylist) {
          alreadyInPlaylistMusicIds.push(musicId);
        } else {

          await this.dbService.playlist.create({
            data: {
              userId,
              musicId,
              playlistName,
            },
          });
          addedMusicIds.push(musicId);
        }
      }


      const response = {
        message: "Playlist updated successfully",
        statusCode: 200,
        updatedPlaylist: {
          added: addedMusicIds,
          alreadyExists: alreadyInPlaylistMusicIds,
          notFound: notFoundMusicIds,
        },
      };

      return response;
    } catch (error) {
      console.error('Error updating playlist:', error);
      return { message: "Internal server error", statusCode: 500, error: error.message };
    }
  }


  async removeMusicFromPlaylist(musicId: number, playlistName: string, userId: string) {

    try {
      const playlistEntry = this.dbService.playlist.findUnique({
        where: { userId_musicId_playlistName: { userId, musicId, playlistName } },
      })

      if (!playlistEntry) {
        return { message: 'Music ID not found in playlist for the specified playlist name', statusCode: 404, musicDetails: { musicId, userId, playlistName } }
      }

      if ((await playlistEntry).userId !== userId) {
        return { message: 'User does not match', statusCode: 400, musicDetails: { musicId, userId, playlistName } }
      }

      await this.dbService.playlist.delete({
        where: { userId_musicId_playlistName: { userId, musicId, playlistName } },
      })

      return { message: 'Music removed from playlist successfully', statusCode: 200, musicDetails: { musicId, userId, playlistName } }
    }
    catch (error) {
      console.error('Error removing music from playlist:', error)
      return { message: 'An error occurred while removing music from playlist', statusCode: 500, error: error.message }
    }

  }

  async updatePlaylistName(userId: string, renamePlaylistDto: renamePlaylistDto) {
    const { playlistName, newPlaylistName } = renamePlaylistDto;

    try {
      // Fetch all playlists with the specified userId and playlistName
      const playlists = await this.dbService.playlist.findMany({
        where: { userId, playlistName },
      });

      if (playlists.length === 0) {
        return { message: 'Playlist not found', statusCode: 404, playlistDetails: playlistName };
      }

      // Update all matching playlists
      const updatePromises = playlists.map(playlist =>
        this.dbService.playlist.update({
          where: { userId_musicId_playlistName: { userId, musicId: playlist.musicId, playlistName: playlist.playlistName } },
          data: { playlistName: newPlaylistName },
        })
      );

      await Promise.all(updatePromises);

      return {
        message: `${updatePromises.length} playlists updated successfully`,
        statusCode: 200,
        playlistDetails: { oldName: playlistName, newName: newPlaylistName }
      };
    } catch (err) {
      console.error('Error updating playlists:', err);
      return {
        message: 'Error updating playlist name',
        statusCode: 500,
        error: err.message,
      };
    }
  }



  async deletePlaylist(userId: string, playlistName: string) {
    console.log(`Are you sure you want to delete ${playlistName}`);

    try {
      // Check if the playlist exists
      const playlist = await this.dbService.playlist.findFirst({
        where: { userId, playlistName },
      });

      if (!playlist) {
        return { message: 'Playlist not found', statusCode: 404, playlistDetails: playlistName };
      }

      // Remove the playlist entry
      await this.dbService.playlist.deleteMany({
        where: {
          userId,
          playlistName,
        },
      });

      return { message: 'Playlist successfully deleted', statusCode: 200, playlistDetails: playlist };

    } catch (error) {
      console.error('Error deleting playlist:', error);
      return {
        message: 'Error deleting playlist',
        statusCode: 500,
        error: error.message,
      };
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
      where: { userId, isFavourite: true },
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
      const { playlistName, Music, createdAt } = playlist;


      const musicArray = Array.isArray(Music) ? Music : [Music];


      if (!playlistMap.has(playlistName)) {
        playlistMap.set(playlistName, {
          playlistName,
          createdAt,
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

      })));
    });

    return Array.from(playlistMap.values());
  }



  async getSharedPlaylistDetails(userID: string, playlistName: string, ownUserId: string): Promise<Music[] | string> {
    try {

      const playlists = await this.dbService.playlist.findMany({
        where: {
          userId: userID,
          playlistName,
        },
      });


      if (!playlists || playlists.length === 0) {
        return 'No data found';
      }

      const musicDetails = await Promise.all(playlists.map(async (playlist) => {

        const music = await this.dbService.music.findUnique({
          where: { id: playlist.musicId },
        });

        const favourite = await this.dbService.isFavourite.findUnique({
          where: {
            userId_id: { userId: ownUserId, id: playlist.musicId },
            isFavourite: true,

          },
        });


        if (music) {
          if (ownUserId === undefined) {
            return {
              id: music.id,
              musicUrl: music.musicUrl,
              thumbnailUrl: music.thumbnailUrl,
              musicTitle: music.musicTitle,
              musicArtist: music.musicArtist,
              createdAt: music.createdAt,
              isFavourite: 'false',
            };
          }
          else {
            return {
              id: music.id,
              musicUrl: music.musicUrl,
              thumbnailUrl: music.thumbnailUrl,
              musicTitle: music.musicTitle,
              musicArtist: music.musicArtist,
              createdAt: music.createdAt,
              isFavourite: favourite ? 'true' : 'false',
            };
          }

        }

        return null;
      }));


      return musicDetails;

    } catch (error) {
      console.error(error);
      return 'An error occurred while fetching playlist details';
    }
  }

  // async getMp3Stream(youtubeUrl: string): Promise<Readable> {
  //   try {
  //     const result = await ytdlp(youtubeUrl, {
  //       extractAudio: true,
  //       audioFormat: 'mp3',
  //       output: 'audio.mp3',

  //     });
  //     console.log("Download process started", result);
  //     return result.stdout;
  //   } catch (error) {
  //     console.error('Error downloading or processing audio:', error);
  //     throw error;
  //   }
  // }





}

