import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],

  providers: [SignupService],
  controllers: [SignupController]
})
export class SignupModule {}
