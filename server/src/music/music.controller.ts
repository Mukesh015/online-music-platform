import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, Req, Res } from '@nestjs/common';
import { MusicService } from './music.service';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Controller('music')
export class MusicController {
  constructor(private readonly musicservice: MusicService) { }

  @Post() // Add the Post decorator to handle POST requests for uploading music
  async upload(
    @Body() createMusicDto: Prisma.MusicCreateInput,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];
    console.log('userId: ' + userId);

    try {
     
      const serviceResponse = await this.musicservice.upload(createMusicDto, userId);

  
      res.status(serviceResponse.statusCode).json({
        message: serviceResponse.message,
        newMusic: serviceResponse.newMusic,
        error: serviceResponse.error,
      });
    } catch (error) {
      console.error('Error in upload controller:', error);
      res.status(500).json({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }

  @Patch(':id') // Define a PATCH endpoint for editing music
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMusicDto: Prisma.MusicUpdateInput, // Add @Body() decorator to capture the request body
    @Req() req: Request,
    @Res() res: Response
  ) {
    const userId = req['firebaseUserId'];
    try {
      const serviceResponse = await this.musicservice.update(updateMusicDto, userId, id);

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
}
