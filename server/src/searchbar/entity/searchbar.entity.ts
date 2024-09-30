import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Favourite {
  @Field()
  id: number;

  @Field()
  musicTitle: string;

  @Field()
  musicArtist: string;

  @Field()
  thumbnailUrl: string;
}

@ObjectType()
export class PreviousSearch {
  @Field()
  searchQuery: string;

  @Field()
  searchHistoryAt: Date;
}

@ObjectType()
export class Suggestion {
  @Field()
  id: number;

  @Field()
  musicTitle: string;

  @Field()
  musicArtist: string;

  @Field()
  thumbnailUrl: string;
}

@ObjectType()
export class SearchResponse {
  @Field(() => [Favourite])
  favourite: Favourite[];

  @Field(() => [PreviousSearch])
  previousSearch: PreviousSearch[];

  @Field(() => [Suggestion])
  suggestion: Suggestion[];
}


@ObjectType()
export class SearchHistory {
  @Field()
  userId: string;

  @Field()
  searchQuery: string;

  @Field()
  searchHistoryAt: Date;
}


@ObjectType()
export class SearchHistoryError {
  @Field()
  code: string;

  @Field()
  status: number;

  @Field()
  message: string;
}


@ObjectType()
export class saveMusic {
  @Field()
  code: string;

  @Field()
  status: number;

  @Field()
  message: string;
}



@ObjectType()
export class MusicDetails {

  @Field()
  id: number;

  @Field()
  musicUrl: string;

  @Field()
  musicTitle: string;

  @Field()
  thumbnailUrl: string;

  @Field()
  musicArtist: string;

  @Field()
  createdAt: Date;

  @Field()
  isFavourite: boolean;

}