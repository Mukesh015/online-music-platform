import { Test, TestingModule } from '@nestjs/testing';
import { SignupResolver } from './signup.resolver';
import { SignupService } from './signup.service';

describe('SignupResolver', () => {
  let resolver: SignupResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupResolver, SignupService],
    }).compile();

    resolver = module.get<SignupResolver>(SignupResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
