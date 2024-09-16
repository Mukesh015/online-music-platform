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

  @Field()
  createdAt: Date;

  @Field(type => [playMusic])
  playlists: playMusic[];
}




export class AddToPlaylistDto {
  @IsString()
  @IsNotEmpty()  
  playlistName: string;

  @IsArray()
  @ArrayNotEmpty() 
  @IsInt({ each: true })  
  musicIds: number[];  
}



export class removeFromPlaylistDto {
  @IsString()
  @IsNotEmpty()  
  playlistName: string;


  @IsNotEmpty()  
  @IsInt()  
  musicId: number;  
}


export class renamePlaylistDto {

  @IsString()
  @IsNotEmpty()  
  playlistName: string;

  @IsString()
  @IsNotEmpty()  
  newPlaylistName: string;
  
}