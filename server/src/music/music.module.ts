import { Module,MiddlewareConsumer,RequestMethod  } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MiddlewareService } from '../middleware/middleware.service'


@Module({
  imports: [DatabaseModule],
 
  providers: [MusicService],
  controllers: [MusicController]
})
export class MusicModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MiddlewareService)
      .forRoutes({ path: 'music', method: RequestMethod.POST });
  }
}
