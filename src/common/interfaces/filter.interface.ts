export interface FilterParams {
  page: number;
  limit: number;
  skip: number;
  search: string;
  sort: 'asc' | 'desc';
  sortBy: string;
  category: string;
}
