// third-party
import cuid from 'cuid';

export function generateCuids(total = 1) {
  return Array.from({ length: total }).map(() => cuid());
}
