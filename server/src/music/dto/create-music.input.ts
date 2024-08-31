import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMusicInput {

  @Field()
  musicUrl: string;

  @Field()
  musicTitle: string;

  @Field()
  thumbnailUrl: string;

  @Field(() => Int)
  musicArtist:string;
  
  @Field({ nullable: true })
  isFavorite?: boolean;
}
