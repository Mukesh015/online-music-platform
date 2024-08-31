import { Module } from '@nestjs/common';
import { AuthGuard } from './authguard.service';

@Module({
  providers: [AuthGuard]
})
export class AuthguardModule {}
