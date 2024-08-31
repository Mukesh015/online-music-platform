import { CreateSignupInput } from './create-signup.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSignupInput extends PartialType(CreateSignupInput) {
  id: number;
}
