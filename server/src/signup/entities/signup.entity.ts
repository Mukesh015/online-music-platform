import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
@InputType()
export class Signup {
  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  name: string;
}

@ObjectType()
export class SignupResponse {
  @Field(() => Int)
  status: number;

  @Field()
  message: string;
}

