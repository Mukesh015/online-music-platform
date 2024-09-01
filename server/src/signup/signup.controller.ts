import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { SignupService } from './signup.service'; // Import your SignupService

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post() 
  async signup(
    @Body() createUserDto: Prisma.UserCreateInput, 
    @Res() res: Response
  ) {
    try {
      const serviceResponse = await this.signupService.signup(createUserDto);

      if (serviceResponse.statusCode==500){
        return res.status(serviceResponse.statusCode).json({
          message: serviceResponse.message,
          error: serviceResponse.error,
        });
      }
      return res.status(serviceResponse.statusCode).json({
        message: serviceResponse.message,
        user: serviceResponse.user,
      });
     
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({
        message: 'An unexpected error occurred during signup',
        error: error.message,
      });
    }
  }
}
