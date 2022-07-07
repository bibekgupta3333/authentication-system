import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetadataEntity } from '../pagination.entity';

// eslint-disable-next-line @typescript-eslint/ban-types
type Entity = Function;

export function getPaginatedResponseType(type: Entity): any {
  class PaginatedResponse<T> implements Paginated<T> {
    @ApiProperty({ type, isArray: true })
    public results: T[];

    @ApiProperty({ type: PaginationMetadataEntity })
    public metadata: PaginationMetadataEntity;
  }
  Object.defineProperty(PaginatedResponse, 'name', {
    value: `Paginated${type.name}`,
  });

  return PaginatedResponse;
}
