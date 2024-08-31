import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Music {
  @Field(() => Int)
  id: number;

  // @Field()
  // userId: string;

  @Field()
  musicUrl: string;

  
  // @Field({ nullable: true })
  // isFavorite?: boolean;
  
  @Field()
  musicTitle: string;

  @Field()
  thumbnailUrl: string;

  @Field(() => Int)
  musicArtist: string;

  // @Field()
  // createdAt: Date;

  @Field()
  updatedAt: Date;
}
