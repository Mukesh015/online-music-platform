import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Favourite {
  @Field()
  musicTitle: string;

  @Field()
  musicArtist: string;
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
  musicTitle: string;

  @Field()
  musicArtist: string;
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