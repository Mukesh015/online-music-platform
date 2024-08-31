import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Music {
  @Field(() => Int)
  id: number;

  // @Field()
  // userId: string;

  @Field()
  url: string;

  
  // @Field({ nullable: true })
  // isFavorite?: boolean;
  
  @Field()
  title: string;

  @Field()
  thumbnail: string;

  @Field(() => Int)
  duration: number;

  // @Field()
  // createdAt: Date;

  @Field()
  updatedAt: Date;
}
