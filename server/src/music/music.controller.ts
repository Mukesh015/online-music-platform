import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { MusicService } from './music.service';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import * as path from 'path';


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
 
}
