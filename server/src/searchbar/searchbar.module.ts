import { Module } from '@nestjs/common';
import { SearchbarResolver } from './searchbar.resolver';
import { SearchbarService } from './searchbar.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],

  providers: [SearchbarResolver, SearchbarService]
})
export class SearchbarModule {}
