// nest
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// config
import { JWT_REFRESH_AUTH } from '../strategies';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_AUTH) {}
