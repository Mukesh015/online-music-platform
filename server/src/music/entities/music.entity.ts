import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Music {
  @Field(() => Int)
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
}
