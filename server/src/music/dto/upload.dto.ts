import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDto {
  
  @IsNotEmpty()
  @IsString()
  userId: string;
}
