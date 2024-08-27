import { Controller,Post,Body } from '@nestjs/common';
import { SignupService } from './signup.service';
import { Prisma } from '@prisma/client';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

    @Post()
    signup(@Body() createUSerDto: Prisma.UserCreateInput) {
      return this.signupService.signup(createUSerDto);
    }
}
