// nest
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// third-party
import omit from 'lodash/omit';

// constants
const FloatRegExp =
  /^[-+]?[0-9]*\.?[0-9]+$ or ^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
const IntRegExp = /^[0-9]*$/;
const DateRegIsoExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

type ValidCollateOptions = 'page' | 'ordering' | 'where';

function getParseOrderByQuery(ordering: string | null) {
  if (!ordering) {
    ordering = 'updatedAt:desc';
  }
  const fieldsWithDirection: string[] = ordering.includes(',')
    ? ordering.split(',')
    : [ordering];

  const isValidFieldPattern = (field: string) =>
    (field.includes(':') && field.includes('asc')) || field.includes('desc');

  return fieldsWithDirection.map((field) => {
    if (!isValidFieldPattern(field)) {
      return;
    }

    const [key, direction] = field.split(':');

    return {
      [key]: direction.toLowerCase() === 'desc' ? 'desc' : 'asc',
    };
  });
}

function parseBasic(value: string): string | null | number | Date | boolean {
  if (value.match(DateRegIsoExp)) {
    return new Date(value);
  }

  if (value.match(FloatRegExp)) {
    return parseFloat(value);
  }

  if (value.match(IntRegExp)) {
    return parseInt(value);
  }

  // handling boolean value
  if (value === 'true' || value === 'false') {
    return value === 'true' ? true : false;
  }
  return value;
}

/**
 * Parses the query string with comparison entities and converts them into prisma where objects
 * TODO: support for validation currently prisma validation error is triggered
 */
function parseSearchAndFiltering(searchAndFilterQs: Record<string, string>) {
  const where = { OR: [] };

  for (const [key, value] of Object.entries(searchAndFilterQs)) {
    const comparisonEntities = key.split('__');
    if (comparisonEntities.length === 1) {
      where['OR'].push({
        [key]: { equals: parseBasic(value) },
      });
      continue;
    }

    const [field, comparison] = comparisonEntities;

    // removing same field lookup complexity
    where['OR'].push({
      [field]: {
        [comparison]: parseBasic(value),
      },
    });
  }
  const isORConditionEmpty = Boolean(where['OR'].length);
  return isORConditionEmpty ? where : {};
}

// Currently matching feature parity with v1
// Might change it to new collation system later on.
export const Collate = createParamDecorator(
  (data: ValidCollateOptions, ctx: ExecutionContext) => {
    const request: TExpressRequest = ctx.switchToHttp().getRequest();

    // (todo): add ordering support
    const ordering = (request.query.ordering as string) ?? '';

    const searchAndFilter = omit(request.query, [
      'ordering',
      'current',
      'pageSize',
    ]);

    // filtering, searching, ordering, pagination
    const collation = {
      page: {
        current: +request.query?.current || 1,
        pageSize: +request.query?.pageSize || 10,
      },
      where: parseSearchAndFiltering(searchAndFilter as Record<string, string>),
      orderBy: getParseOrderByQuery(ordering),
    };

    if (!data) return collation;

    if (data in collation) return collation[data];

    console.warn(`Collate: ${data} not found in request`);

    return null;
  },
);
