import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type AuthContextDecoratorProps = 'profile' | 'organization' | 'session';

export const AuthContext = createParamDecorator(
  (data: AuthContextDecoratorProps, ctx: ExecutionContext) => {
    const request: ExpressRequestWith<TAuthContext | null | undefined> = ctx
      .switchToHttp()
      .getRequest();

    if (!request.user) {
      console.warn(`
            AuthContext: No user found in request.
            This is likely due to a missing @UseGuards(JwtGuard)       
        `);

      return {
        profile: null,
        organization: null,
        session: null,
      };
    }

    if (!data) return request.user as TAuthContext;

    return request.user[data];
  },
);
