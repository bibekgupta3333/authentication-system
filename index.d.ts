type TExpressRequest = import('express').Request;

type Paginated<T> = {
  results: T[];
  metadata: {
    totalPages: number;
    next: boolean | null;
    previous: boolean | null;
    current: number;
    pageSize: number;
    totalItems: number;
  };
};

// Collation Context
type TCollatedPage = {
  current: number;
  pageSize: number;
};

type TCollatedOrdering = Record<string, any>;
type TCollatedWhere = Record<string, any>;

type TCollation = {
  page: TCollatedPage;
  ordering: TCollatedOrdering;
  where: TCollatedWhere;
};
