import { Resolver, Query, Args, Context, Mutation } from '@nestjs/graphql';
import { SearchbarService } from './searchbar.service';
import { SearchResponse,SearchHistory,SearchHistoryError,MusicDetails } from './entity/searchbar.entity';
import {  UseGuards } from '@nestjs/common';
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

  @Mutation(() => SearchHistory ||SearchHistoryError )
  @UseGuards(AuthGuard)
  async saveSearchQuery(
    @Args('searchQuery', { type: () => String }) searchQuery: string,
    @Context() context
  ): Promise<SearchHistory | SearchHistoryError> {
    const userId = context.req['firebaseUserId'];
  
    if (!userId || userId === "null" || userId === "invalid") {

      return { status: 401, message: "Please Login or refresh", code: "NTP" };
    }

    if (!searchQuery) {

      return { status: 400, message: "Search Query is required", code: "SQR" };
    }

    try {
   
      const existingSearch = await this.searchbarService.findSearchQuery(userId, searchQuery);
      if (existingSearch) {
    
        return { status: 400, message: "Search query already saved", code: "SQS" };
      }


      const savedSearch = await this.searchbarService.saveSearchQuery(userId, searchQuery);
      return savedSearch;
    } catch (error) {

      return { status: 500, message: "Internal server error", code: "ISE" };
    }
  }


  @UseGuards(AuthGuard)
  @Query(returns => [MusicDetails])
  async searchMusic(@Args('searchQuery') searchQuery: string, 
  @Context() context): Promise<MusicDetails[]> {
    const userId = context.req['firebaseUserId'];
    if (!userId || userId === "null" || userId === "invalid") {
  
      return this.searchbarService.getSanitizedMusicResults(searchQuery, null);

    }


    return this.searchbarService.getSanitizedMusicResults(searchQuery, userId);
  }
}
