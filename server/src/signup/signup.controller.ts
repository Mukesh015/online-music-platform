import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { SignupService } from './signup.service'; // Import your SignupService

@Controller('auth')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup') // Endpoint for user signup
  async signup(
    @Body() createUserDto: Prisma.UserCreateInput, 
    @Res() res: Response
  ) {
    try {
      const serviceResponse = await this.signupService.signup(createUserDto);

      // Send response based on the status code returned by the service
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
