import { Injectable } from '@nestjs/common';
import { Favourite, PreviousSearch, Suggestion, SearchResponse } from './entity/searchbar.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SearchbarService {

  constructor(private readonly dbService: DatabaseService) { }
  async search(searchString: string | null, userId: string): Promise<SearchResponse> {
    const favourite: Favourite[] = [];
    const previousSearch: PreviousSearch[] = [];
    const suggestion: Suggestion[] = [];


    if (searchString === null) {

      const favourites = await this.dbService.isFavourite.findMany({
        include: {
          music: true,
        },
      });

      for (const fav of favourites) {
        favourite.push({
          musicTitle: fav.music.musicTitle,
          musicArtist: fav.music.musicArtist,
        });
      }


      const previousSearches = await this.dbService.searchHistory.findMany({
        where: {
          userId: userId,
        },
      });

      for (const search of previousSearches) {
        previousSearch.push({
          searchQuery: search.searchQuery,
          searchHistoryAt: search.searchHistoryAt,
        });
      }
    } else {

      const searchResults = await this.dbService.music.findMany({
        where: {
          OR: [
            { musicTitle: { contains: searchString, mode: 'insensitive' } },
            { musicArtist: { contains: searchString, mode: 'insensitive' } },
          ],
        },
      });

      for (const result of searchResults) {
        suggestion.push({
          musicTitle: result.musicTitle,
          musicArtist: result.musicArtist,
        });
      }
      const previousSearches = await this.dbService.searchHistory.findMany({
        where: {
          userId: userId,
        },
      });

      const relevantSearches = previousSearches.filter(search =>
        search.searchQuery.includes(searchString)
      );

      for (const search of relevantSearches) {
        const searchResultsFromHistory = await this.dbService.music.findMany({
          where: {
            OR: [
              { musicTitle: { contains: search.searchQuery, mode: 'insensitive' } },
              { musicArtist: { contains: search.searchQuery, mode: 'insensitive' } },
            ],
          },
        });

        for (const result of searchResultsFromHistory) {

          if (!suggestion.some(s => s.musicTitle === result.musicTitle && s.musicArtist === result.musicArtist)) {
            suggestion.push({
              musicTitle: result.musicTitle,
              musicArtist: result.musicArtist,
            });
          }
        }
      }

      for (const search of previousSearches) {
        previousSearch.push({
          searchQuery: search.searchQuery,
          searchHistoryAt: search.searchHistoryAt,
        });
      }

    }

    return {
      favourite,
      previousSearch,
      suggestion,
    };
  }



  async searchWithEmptyHistory(searchString: string | null): Promise<SearchResponse> {
    const favourite: Favourite[] = [];
    const suggestion: Suggestion[] = [];

    if (searchString === null) {

      const favourites = await this.dbService.isFavourite.findMany({
        include: {
          music: true,
        },
      });

      for (const fav of favourites) {
        favourite.push({
          musicTitle: fav.music.musicTitle,
          musicArtist: fav.music.musicArtist,
        });
      }
    } else {

      const searchResults = await this.dbService.music.findMany({
        where: {
          OR: [
            { musicTitle: { contains: searchString, mode: 'insensitive' } },
            { musicArtist: { contains: searchString, mode: 'insensitive' } },
          ],
        },
      });

      for (const result of searchResults) {
        suggestion.push({
          musicTitle: result.musicTitle,
          musicArtist: result.musicArtist,
        });
      }
    }

    return {
      favourite,
      previousSearch: [],
      suggestion,
    };
  }

}
