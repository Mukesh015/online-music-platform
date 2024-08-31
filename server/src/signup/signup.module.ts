import { Module } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupResolver } from './signup.resolver';
import { DatabaseModule } from '../database/database.module';
import { SignupController } from './signup.controller';

@Module({
  imports:[DatabaseModule],
  providers: [SignupResolver, SignupService],
  controllers: [SignupController],
})
export class SignupModule {}
