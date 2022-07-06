import { Injectable } from '@nestjs/common';

type PaginationConfig = {
  current: number;
  pageSize: number;
  MIN_PAGE_SIZE?: number;
  MAX_PAGE_SIZE?: number;
};

type PaginationArgs<T, U> = {
  findAll: (take: number, skip: number) => Promise<T[]>;
  count: () => Promise<number>;
  config: PaginationConfig;
  serializer?: (entity: T) => U;
  shouldClamp?: boolean;
};

@Injectable()
export class PaginationService {
  // Probably should be moved to a config file
  private MIN_PAGE_SIZE = 1;
  private MAX_PAGE_SIZE = 100;

  public async paginate<T, U>({
    findAll,
    count,
    config: { pageSize, current },
    serializer,
    shouldClamp = false,
  }: PaginationArgs<T, U>): Promise<Paginated<U>> {
    const totalEntities = await count();

    const totalPages = Math.ceil(totalEntities / pageSize);

    if (!serializer) serializer = (entity: T) => entity as unknown as U;

    if (shouldClamp) {
      // clamping the page size to the max and min
      pageSize = Math.max(
        this.MIN_PAGE_SIZE,
        Math.min(pageSize, this.MAX_PAGE_SIZE),
      );
      // clamping the current page to the max and min
      current = Math.max(1, Math.min(current, totalPages));
    }

    const ormEntities = await findAll(
      parseInt(String(pageSize), 10),
      parseInt(String((current - 1) * pageSize), 10),
    );

    return {
      results: ormEntities.map(serializer),
      metadata: {
        current,
        next: current < totalPages,
        previous: current > 1,
        pageSize,
        totalPages,
        totalItems: totalEntities,
      },
    };
  }
}
