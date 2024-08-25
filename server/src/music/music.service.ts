import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MusicService {
    constructor(private readonly dbService: DatabaseService) { }
    async signup(createUserDto: Prisma.UserCreateInput) {
        const { userId } = createUserDto;

        const existingUser = await this.dbService.user.findUnique({
            where: { userId },
        });

        if (existingUser) {
            return {status: 0,message: "user already exists" }
        }

        try {
            const newUser = await this.dbService.user.create({
                data: createUserDto,
            });
            return { status: 1, message: "user created successfully" };
        } catch (error) {
            
            throw new ConflictException('Failed to create user');
        }
    }
}


