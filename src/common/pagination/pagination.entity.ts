import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationMetadataEntity {
  @Expose()
  current: number;

  @ApiProperty({ default: false })
  @Expose()
  next: boolean;

  @ApiProperty({ default: false })
  @Expose()
  previous: boolean;

  @Expose()
  pageSize: number;

  @Expose()
  totalPages: number;

  @Expose()
  totalItems: number;

  constructor(metadata: Partial<PaginationMetadataEntity>) {
    Object.assign(this, metadata);
  }
}
