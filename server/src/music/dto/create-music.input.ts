import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMusicInput {
    
  @Field()
  url: string;

  @Field()
  title: string;
  
  @Field()
  thumbnail: string;

  @Field(() => Int)
  duration: number;

  @Field({ nullable: true })
  isFavorite?: boolean;
}
