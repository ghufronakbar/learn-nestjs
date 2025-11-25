import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FilterParams } from '../interfaces/filter.interface';

const sanitizeSingleValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return String(value[value.length - 1]);
  }
  return value ? String(value) : '';
};

export const QueryParams = createParamDecorator(
  (allowedSortFields: string[] = [], ctx: ExecutionContext): FilterParams => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    // 1. Sanitized & Parsing
    const rawPage = sanitizeSingleValue(query.page);
    const rawLimit = sanitizeSingleValue(query.limit);
    const rawSearch = sanitizeSingleValue(query.search);
    const rawSort = sanitizeSingleValue(query.sort);
    const rawSortBy = sanitizeSingleValue(query.sortBy);

    const page = Number(rawPage) || 1;
    const limit = Number(rawLimit) || 10;
    const sort = rawSort.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // 2. Whitelist SortBy
    const allAllowedSortFields = [
      'createdAt',
      'updatedAt',
      ...allowedSortFields,
    ];

    // b. Declare default value
    let sortBy = 'createdAt';

    // c. Check if input user is in whitelist
    // If yes, use input user. If no, use default 'createdAt'.
    if (rawSortBy && allAllowedSortFields.includes(rawSortBy)) {
      sortBy = rawSortBy;
    }

    // 3. Calculate Skip
    const skip = (page - 1) * limit;

    // 4. Sanitize remaining query params
    const {
      page: _p,
      limit: _l,
      search: _s,
      sort: _so,
      sortBy: _sb,
      ...otherParamsRaw
    } = query;

    const otherParams: any = {};
    Object.keys(otherParamsRaw).forEach((key) => {
      otherParams[key] = sanitizeSingleValue(otherParamsRaw[key]);
    });

    return {
      page,
      limit,
      search: rawSearch,
      sort,
      sortBy,
      skip,
      ...otherParams,
    };
  },
);
