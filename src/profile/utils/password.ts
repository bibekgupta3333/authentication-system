// third-party
import * as bcrypt from 'bcrypt';

// config
import { ENV } from '@config/env';

export function hashPassword(rawPassword: string): string {
  return bcrypt.hashSync(rawPassword, ENV.APP_SALT_ROUNDS);
}

export function checkPassword(
  rawPassword: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(rawPassword, hashedPassword);
}
