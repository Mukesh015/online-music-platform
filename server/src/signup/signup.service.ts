import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSignupInput } from './dto/create-signup.input'
import { SignupResponse } from './entities/signup.entity';
import { Prisma } from '@prisma/client';
@Injectable()
export class SignupService {
  constructor(private readonly dbService: DatabaseService) { }
  async create(createUserDto: CreateSignupInput): Promise<SignupResponse> {
    const { userId } = createUserDto;

    const existingUser = await this.dbService.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      return { status: 0, message: "User already exists" };
    }

    try {
      await this.dbService.user.create({
        data: createUserDto,
      });
      return { status: 1, message: "User created successfully" };
    } catch (error) {
      throw new ConflictException('Failed to create user');
    }
  }
  async signup(createUserDto: Prisma.UserCreateInput) {
    const { userId } = createUserDto;

    const existingUser = await this.dbService.user.findUnique({
      where: { userId },
    });

    if (existingUser) {

      return { statusCode: 200, message: "Loggedin Successfully", user: createUserDto };
    }

    try {

      await this.dbService.user.create({
        data: createUserDto,
      });

      return { statusCode: 201, message: "User created successfully", user: createUserDto };
    } catch (error) {

      console.error("Error creating user:", error);


      if (error.code === 'P2002') {

        return { statusCode: 409, message: "User with this ID already exists", user: createUserDto };
      } else {

        return { statusCode: 500, message: "An error occurred while creating the user", error: error.message };
      }
    }
  }

  async addToLastHistory(addToLastHistoryDto: Prisma.lasthistoryCreateInput, userId: string) {
    try {
      const lasthistory = await this.dbService.lasthistory.upsert({
        where: {
          userId_musicId: {
            userId: userId,
            musicId: addToLastHistoryDto.musicId,
          },
        },
        update: {
          musicUrl: addToLastHistoryDto.musicUrl,
          thumbnailUrl: addToLastHistoryDto.thumbnailUrl,
          musicTitle: addToLastHistoryDto.musicTitle,
          musicArtist: addToLastHistoryDto.musicArtist,
          lastPlayedAt: addToLastHistoryDto.lastPlayedAt,
        },
        create: {
          userId: userId,
          musicId: addToLastHistoryDto.musicId,
          musicUrl: addToLastHistoryDto.musicUrl,
          thumbnailUrl: addToLastHistoryDto.thumbnailUrl,
          musicTitle: addToLastHistoryDto.musicTitle,
          musicArtist: addToLastHistoryDto.musicArtist,
          lastPlayedAt: addToLastHistoryDto.lastPlayedAt,
        },
      });
      return { statusCode: 200, message: "Added to last history successfully", lasthistory: lasthistory };
    }
    catch (error) {
      console.error("Error adding to last history:", error);
      return { statusCode: 500, message: "An error occurred while adding to last history", error: error.message };
    }

  }


  async findLastHistory(userId: string) {
    return this.dbService.lasthistory.findFirst({
      where: {
        userId: userId,
      },
    });
  }


}
