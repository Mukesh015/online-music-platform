import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupResolver } from './signup.resolver';
import { DatabaseModule } from '../database/database.module';
import { SignupController } from './signup.controller';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { AuthGuard } from '../authguard/authguard.service'

@Module({
  imports: [DatabaseModule],
  providers: [SignupResolver, SignupService, AuthGuard],
  controllers: [SignupController],
})
export class SignupModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareService)
      .forRoutes(
        { path: 'signup/addtolasthistory', method: RequestMethod.POST },

      );
  }
}
