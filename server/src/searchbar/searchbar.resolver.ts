import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { SearchbarService } from './searchbar.service';
import { SearchResponse } from './entity/searchbar.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authguard/authguard.service';

@Resolver()
export class SearchbarResolver {
  constructor(private readonly searchbarService: SearchbarService) {}

  @Query(() => SearchResponse)
  @UseGuards(AuthGuard)
  async search(
    @Args('searchString', { type: () => String, nullable: true }) searchString: string | null,@Context() context
  ): Promise<SearchResponse> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null" || userId === "invalid") {
 
        return this.searchbarService.searchWithEmptyHistory(searchString);
    }

    return this.searchbarService.search(searchString,userId);
  }
}
