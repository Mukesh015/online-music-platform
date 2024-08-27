import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SignupService {
    constructor(private readonly dbService: DatabaseService) { }

    async signup(createUserDto: Prisma.UserCreateInput) {
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
}
