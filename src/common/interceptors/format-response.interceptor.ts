// nest
import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

// third-party
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const status = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => {
        return {
          status,
          data,
          error: null,
        };
      }),
    );
  }
}
