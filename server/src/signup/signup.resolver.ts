import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SignupService } from './signup.service';
import { CreateSignupInput } from './dto/create-signup.input';

import { Signup,SignupResponse } from './entities/signup.entity';

@Resolver(() => SignupResponse)
export class SignupResolver {
  constructor(private readonly signupService: SignupService) {}

  @Mutation(() => SignupResponse)
  async create(@Args('createSignupInput') createSignupInput: CreateSignupInput): Promise<SignupResponse> {
    return this.signupService.create(createSignupInput);
  }
}
