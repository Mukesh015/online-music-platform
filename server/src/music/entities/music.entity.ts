import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

@ObjectType()
export class Music {
  @Field(() => Int)
  id: number;

  @Field()
  musicUrl: string;


  @Field()
  isFavourite: string;


  @Field()
  musicTitle: string;

  @Field()
  thumbnailUrl: string;

  @Field()
  musicArtist: string;

  @Field()
  createdAt: Date;
  
}


@ObjectType()
export class playMusic {
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

@ObjectType()
export class Playlist {
  @Field()
  playlistName: string;

  @Field(type => [playMusic])
  playlists: playMusic[];
}




export class AddToPlaylistDto {
  @IsString()
  @IsNotEmpty()  // Ensures the string is not empty and not null
  playlistName: string;

  @IsArray()
  @ArrayNotEmpty()  // Ensures the array is not empty
  @IsInt({ each: true })  // Ensures each element in the array is an integer
  musicIds: number[];  // Array of music IDs
}
