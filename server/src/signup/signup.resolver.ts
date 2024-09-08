import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { SignupService } from './signup.service';
import { CreateSignupInput } from './dto/create-signup.input';

import { LastHistory, Signup,SignupResponse } from './entities/signup.entity';
import { AuthGuard } from '../authguard/authguard.service';
import { UseGuards } from '@nestjs/common';

@Resolver(() => SignupResponse)
export class SignupResolver {
  constructor(private readonly signupService: SignupService) {}

  @Mutation(() => SignupResponse)
  async create(@Args('createSignupInput') createSignupInput: CreateSignupInput): Promise<SignupResponse> {
    return this.signupService.create(createSignupInput);
  }

  @Query(returns => LastHistory)
  @UseGuards(AuthGuard)
  async getLastHistory(@Context() context): Promise<LastHistory | null> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null" || userId === "invalid") {
      return null;
    }
    return this.signupService.findLastHistory(userId)
  }

}