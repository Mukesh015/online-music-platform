import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { SignupService } from './signup.service';
import { CreateSignupInput } from './dto/create-signup.input';

import { Signup, SignupResponse,LastHistory } from './entities/signup.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authguard/authguard.service';


@Resolver(() => SignupResponse)
export class SignupResolver {
  constructor(private readonly signupService: SignupService) { }
  @Query(returns => [LastHistory])
  @UseGuards(AuthGuard)
  async getMusicByUserId(@Context() context): Promise<LastHistory | null> {
    const userId = context.req['firebaseUserId'];
    if (userId === "null" || userId === "invalid") {
      return null;
    }
    return this.signupService.findLastHistory(userId)
  }

}
