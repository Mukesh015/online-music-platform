import { Injectable } from '@nestjs/common';
import { Favourite, PreviousSearch, Suggestion, SearchResponse, SearchHistory, MusicDetails } from './entity/searchbar.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SearchbarService {

  constructor(private readonly dbService: DatabaseService) { }

  private sanitizeSearchString(searchString: string | null): string {
    if (searchString === null) return '';
    return searchString
      .replace(/\s+/g, '')
      .replace(/[^\w\s]/gi, '')
      .toLowerCase();
  }

  async search(searchString: string | null, userId: string): Promise<SearchResponse> {
    const favourite: Favourite[] = [];
    const previousSearch: PreviousSearch[] = [];
    const suggestion: Suggestion[] = [];
    const sanitizedSearchString = this.sanitizeSearchString(searchString);

    if (!sanitizedSearchString) {

      const favourites = await this.dbService.isFavourite.findMany({
        include: {
          music: true,
        },
      });

      for (const fav of favourites) {
        favourite.push({
          id: fav.music.id,
          musicTitle: fav.music.musicTitle,
          musicArtist: fav.music.musicArtist,
          thumbnailUrl: fav.music.thumbnailUrl,
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

      const searchResults = await this.dbService.music.findMany();

      const filteredResults = searchResults.filter(result => {
        const sanitizedTitle = this.sanitizeSearchString(result.musicTitle);
        const sanitizedArtist = this.sanitizeSearchString(result.musicArtist);

        return sanitizedTitle.includes(sanitizedSearchString) || sanitizedArtist.includes(sanitizedSearchString);
      });

      for (const result of filteredResults) {
        suggestion.push({
          id: result.id,
          musicTitle: result.musicTitle,
          musicArtist: result.musicArtist,
          thumbnailUrl: result.thumbnailUrl,
        });
      }

      const previousSearches = await this.dbService.searchHistory.findMany({
        where: {
          userId: userId,
        },
      });

      const relevantSearches = previousSearches.filter(search =>
        this.sanitizeSearchString(search.searchQuery).includes(sanitizedSearchString)
      );

      for (const search of relevantSearches) {
        const searchResultsFromHistory = await this.dbService.music.findMany();

        const filteredHistoryResults = searchResultsFromHistory.filter(result => {
          const sanitizedTitle = this.sanitizeSearchString(result.musicTitle);
          const sanitizedArtist = this.sanitizeSearchString(result.musicArtist);

          return sanitizedTitle.includes(this.sanitizeSearchString(search.searchQuery)) ||
            sanitizedArtist.includes(this.sanitizeSearchString(search.searchQuery));
        });

        for (const result of filteredHistoryResults) {
          if (!suggestion.some(s => s.musicTitle === result.musicTitle && s.musicArtist === result.musicArtist)) {
            suggestion.push({
              id: result.id,
              musicTitle: result.musicTitle,
              musicArtist: result.musicArtist,
              thumbnailUrl: result.thumbnailUrl,
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
    const sanitizedSearchString = this.sanitizeSearchString(searchString);

    if (!sanitizedSearchString) {

      const favourites = await this.dbService.isFavourite.findMany({
        include: {
          music: true,
        },
      });

      for (const fav of favourites) {
        favourite.push({
          id: fav.music.id,
          musicTitle: fav.music.musicTitle,
          musicArtist: fav.music.musicArtist,
          thumbnailUrl: fav.music.thumbnailUrl,
        });
      }
    } else {

      const searchResults = await this.dbService.music.findMany();

      const filteredResults = searchResults.filter(result => {
        const sanitizedTitle = this.sanitizeSearchString(result.musicTitle);
        const sanitizedArtist = this.sanitizeSearchString(result.musicArtist);

        return sanitizedTitle.includes(sanitizedSearchString) || sanitizedArtist.includes(sanitizedSearchString);
      });

      for (const result of filteredResults) {
        suggestion.push({
          id: result.id,
          musicTitle: result.musicTitle,
          musicArtist: result.musicArtist,
          thumbnailUrl: result.thumbnailUrl,
        });
      }
    }

    return {
      favourite,
      previousSearch: [],
      suggestion,
    };
  }


  async findSearchQuery(userId: string, searchQuery: string): Promise<SearchHistory | null> {
    return this.dbService.searchHistory.findFirst({
      where: {
        userId,
        searchQuery
      }
    });
  }

  async saveSearchQuery(userId: string, searchQuery: string): Promise<SearchHistory> {
    return this.dbService.searchHistory.create({
      data: {
        userId,
        searchQuery,

      },
    });
  }
  async getSanitizedMusicResults(query: string | null, userId: string | null): Promise<MusicDetails[]> {
    const sanitizedSearchString = this.sanitizeSearchString(query);

    if (!sanitizedSearchString) {

      const favourites = await this.dbService.isFavourite.findMany({
        where: userId ? { userId } : undefined,
        include: {
          music: true,
        },
      });

      return favourites.map(fav => ({
        id: fav.music.id,
        musicUrl: fav.music.musicUrl,
        musicTitle: fav.music.musicTitle,
        musicArtist: fav.music.musicArtist,
        thumbnailUrl: fav.music.thumbnailUrl,
        createdAt: fav.music.createdAt,
        isFavourite: userId ? fav.isFavourite : false,
      }));
    }


    const musicResults = await this.dbService.music.findMany();

    const filteredResults = musicResults.filter(result => {
      const sanitizedTitle = this.sanitizeSearchString(result.musicTitle);
      const sanitizedArtist = this.sanitizeSearchString(result.musicArtist);

      return sanitizedTitle.includes(sanitizedSearchString) || sanitizedArtist.includes(sanitizedSearchString);
    });

    let finalResults = filteredResults;
    if (filteredResults.length === 0) {

      const partialMatches = musicResults.filter(result => {
        const sanitizedTitle = this.sanitizeSearchString(result.musicTitle);
        const sanitizedArtist = this.sanitizeSearchString(result.musicArtist);

    
        return sanitizedTitle.startsWith(sanitizedSearchString.slice(0, 3)) ||
          sanitizedArtist.startsWith(sanitizedSearchString.slice(0, 3));
      });

      finalResults = partialMatches.length > 0 ? partialMatches : musicResults.slice(0, 10); // Last resort: return top 10 results
    }

    const userFavourites = userId
      ? await this.dbService.isFavourite.findMany({
        where: { userId },
      })
      : [];

    return finalResults.map(music => ({
      id: music.id,
      musicUrl: music.musicUrl,
      musicTitle: music.musicTitle,
      musicArtist: music.musicArtist,
      thumbnailUrl: music.thumbnailUrl,
      createdAt: music.createdAt,
      isFavourite: userId
        ? userFavourites.some(fav => fav.id === music.id && fav.isFavourite)
        : false,
    }));
  }

}
