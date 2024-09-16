import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { MusicService } from './music.service';
import { Prisma } from '@prisma/client';
import { query, Request, Response } from 'express';
import { AddToPlaylistDto } from './entities/music.entity';
import { ApiTags } from '@nestjs/swagger';

interface SuccessResponse {
  message: string;
  statusCode: number;
  updatedPlaylist: {
    added: number[];
    alreadyExists: number[];
    notFound: number[];
  };
}

interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}
interface PlaylistDetails {
  added: number[];
  alreadyExists: number[];
  notFound: number[];
}

interface AddToPlaylistResponse {
  statusCode: number;
  message: string;
  playlistDetails?: PlaylistDetails;
  error?: string;
}
type UpdatePlaylistResponse = SuccessResponse | ErrorResponse;

@ApiTags('Music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicservice: MusicService) { }

  @Post()
  async upload(
    @Body() createMusicDto: Prisma.MusicCreateInput,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];



    try {

      const serviceResponse = await this.musicservice.upload(createMusicDto, userId);

      if (serviceResponse.statusCode === 500) {
        res.status(serviceResponse.statusCode).json({
          message: serviceResponse.message,
          error: serviceResponse.error,
        });

      }
      else {
        res.status(serviceResponse.statusCode).json({
          message: serviceResponse.message,
          newMusic: serviceResponse.newMusic,

        });
      }
    } catch (error) {
      console.error('Error in upload controller:', error);
      res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMusicDto: Prisma.MusicUpdateInput,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];
    try {
      const serviceResponse = await this.musicservice.update(updateMusicDto, userId, id);
      if (serviceResponse.statusCode = 500) {
        res.status(serviceResponse.statusCode).json({
          message: serviceResponse.message,
          error: serviceResponse.error
        })
      }
      res.status(serviceResponse.statusCode).json({
        message: serviceResponse.message,
        updatedMusic: serviceResponse.updatedMusic,
      });
    } catch (error) {
      console.error('Error in edit controller:', error);
      res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {

    const userId = req['firebaseUserId'];
    try {
      const serviceResponse = await this.musicservice.remove(id, userId);
      if (serviceResponse.statusCode === 500) {
        res.status(serviceResponse.statusCode).json({
          message: serviceResponse.message,
          error: serviceResponse.error

        });
      }
      res.status(serviceResponse.statusCode).json({
        message: serviceResponse.message,
        musicDetails: serviceResponse.musicDetails

      });
    } catch (error) {
      console.error('Error in delete controller:', error);
      res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  @Patch('addtoFavorite/:id')
  async addToFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];

    try {
      const result = await this.musicservice.addToFavorite(id, userId);


      if (result.statusCode === 200) {
        res.status(HttpStatus.OK).json({
          message: result.message,
          favoriteMusic: result.musicDetails,
        });
      } else if (result.statusCode === 404) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: result.message,
          favoriteMusic: result.musicDetails,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error in addToFavorite controller:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while processing your request',
        error: error.message,
      });
    }
  }


  // @Post('upload')
  // async getMp3(
  //   @Body('youtubeUrl') youtubeUrl: string,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ): Promise<void> {
  //   if (!youtubeUrl) {
  //     res.status(400).json({ error: 'YouTube URL is required' });
  //   }

  //   try {
  //     const mp3Stream = await this.musicservice.getMp3Stream(youtubeUrl);

  //     if (mp3Stream) {
  //       const bufferStream = new PassThrough(); // Stream to buffer data

  //       let totalSize = 0; // Initialize size counter
  //       mp3Stream.on('data', (chunk) => {
  //         totalSize += chunk.length; // Accumulate chunk sizes
  //         bufferStream.write(chunk); // Write chunks to the buffer stream
  //       });

  //       mp3Stream.on('end', () => {
  //         bufferStream.end();


  //         res.setHeader('Content-Type', 'audio/mpeg');
  //         res.setHeader('Content-Disposition', 'attachment; filename="audio.mp3"');
  //         res.setHeader('Content-Length', totalSize);


  //         bufferStream.pipe(res);

  //         bufferStream.on('end', () => {
  //           console.log('MP3 file has been successfully streamed to the client.');
  //         });
  //       });

  //       mp3Stream.on('error', (error) => {
  //         console.error('Error during MP3 streaming:', error);
  //         if (!res.headersSent) {
  //           res.status(500).json({ error: 'Error streaming MP3 file' });
  //         }
  //       });
  //     } else {
  //       res.status(500).json({ error: 'Failed to retrieve MP3 stream' });
  //     }
  //   } catch (error) {
  //     console.error('Error fetching MP3 stream:', error);
  //     res.status(500).json({ error: 'Failed to fetch MP3' });
  //   }
  // }


  @Post('addtoplaylist')
  async addtoplaylist(@Body() addtoplaylistDto: AddToPlaylistDto,
    @Req() req: Request,
    @Res() res: Response) {
    const userId = req['firebaseUserId'];
    try {
      const response: AddToPlaylistResponse = await this.musicservice.addToPlaylist(userId, addtoplaylistDto);

      if (response.statusCode === 200) {
        return res.status(response.statusCode).json({
          message: response.message,
          playlistDetails: response.playlistDetails,
        });
      } else if (response.statusCode === 500) {
        return res.status(response.statusCode).json({
          message: response.message,
          error: response.error,
        });
      }

      // Handle unexpected status codes
      throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    } catch (error) {
      console.error('Error in updatePlaylist controller:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
  @Patch('updatePlaylist')
  async updatePlaylist(
    @Body() updatePlaylist: AddToPlaylistDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];

    try {
      const response: UpdatePlaylistResponse = await this.musicservice.updatePlaylist(updatePlaylist, userId);

      if ('updatedPlaylist' in response) {
        return res.status(response.statusCode).json({
          message: response.message,
          updatedPlaylist: response.updatedPlaylist,
        });
      } else {

        return res.status(response.statusCode).json({
          message: response.message,
          error: response.error,
        });
      }
    } catch (error) {
      console.error('Error in updatePlaylist controller:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }
  @Delete('removefromplaylist')
  async removeFromPlaylist(
    @Body() removeFromPlaylistDto: { musicId: number, playlistName: string },
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];
    const { musicId, playlistName } = removeFromPlaylistDto;

    try {
      const response = await this.musicservice.removeFromPlaylist(musicId, userId, playlistName);
      if (response.statusCode === 500) {

        return res.status(response.statusCode).json({
          message: response.message,
          error: response.error,
        });
      }
      res.status(response.statusCode).json({
        "message": response.message,
        "details": response.musicDetails
      });
    } catch (error) {
      console.error('Error in removeFromPlaylist controller:', error)

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  @Patch('/rename/playlist')
  async updatePlaylisName(
    @Body() renamePlaylistDto: { playlistName: string, newPlaylistName: string },
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];
    const { playlistName, newPlaylistName } = renamePlaylistDto
    try {
      const response = await this.musicservice.updatePlaylistName(userId, playlistName, newPlaylistName);
      if (response.statusCode === 500) {
        return res.status(response.statusCode).json({
          message: response.message,
          error: response.error,
        });
      }
      res.status(response.statusCode).json({
        "message": response.message,
        "details": response.playlistDetails
      });
    }
    catch (error) {
      console.error('Error in updatePlaylisName controller:', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }

  }

  @Delete('delete/playlist')
  async deletePlaylist(
    @Body() deletePlaylistDto: { playlistName: string },
    @Req() req: Request,
    @Res() res: Response
  ) {

    const userId = req['firebaseUserId'];
    const { playlistName } = deletePlaylistDto;
    try {
      const response = await this.musicservice.deletePlaylist(userId, playlistName);
      if (response.statusCode === 500) {
        return res.status(response.statusCode).json({
          message: response.message,
          error: response.error,
        });
      }

      res.status(response.statusCode).json({
        "message": response.message,
        "details": response.playlistDetails
      });
    }
    catch (error) {
      console.error('Error in updatePlaylisName controller:', error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }

  }
}

