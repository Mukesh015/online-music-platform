import { Field, InputType } from "@nestjs/graphql";
@InputType()
export class CreateSignupInput {
    
    @Field()
    userId: string;

    @Field()
    name:string;

    @Field()
    email:string
}
