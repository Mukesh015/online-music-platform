import { CreateMusicInput } from './create-music.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMusicInput extends PartialType(CreateMusicInput) {
  id: number;
}
