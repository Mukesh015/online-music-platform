import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicResolver } from './music.resolver';
import { DatabaseModule } from '../database/database.module';
import { MusicController } from './music.controller';
import { MiddlewareService } from '../middleware/middleware.service';
import {AuthGuard} from '../authguard/authguard.service'

@Module({
  imports: [DatabaseModule],
  providers: [MusicResolver, MusicService, AuthGuard],
  controllers: [MusicController],

})
export class MusicModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareService)
      .forRoutes(
        { path: 'music', method: RequestMethod.POST },
        { path: 'music/:id', method: RequestMethod.PATCH },
        { path: 'music/:id', method: RequestMethod.DELETE },
        
      );
  }
}
