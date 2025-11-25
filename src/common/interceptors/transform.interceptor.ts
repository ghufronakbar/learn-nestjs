import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  error: null;
  statusCode: number;
  data: T;
  pagination?: any;
  filterQuery?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        // Cek apakah response dari service punya format pagination
        // (yaitu object yang punya properti: data, total, params)
        const isPaginated =
          res &&
          typeof res === 'object' &&
          'data' in res &&
          'total' in res &&
          'params' in res;

        console.log({ isPaginated });
        if (isPaginated) {
          const { data, total, params } = res;
          const { page, limit } = params;

          // Hitung Logika Pagination
          const totalPages = Math.ceil(total / limit);

          return {
            message: 'Success',
            error: null,
            statusCode,
            data: data, // Array data utama
            pagination: {
              total,
              page,
              limit,
              totalPages,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1,
            },
            filterQuery: params, // Object params dari decorator tadi
          };
        }

        // Jika bukan pagination (misal getById atau Create), return standar
        return {
          message: 'Success',
          error: null,
          statusCode,
          data: res,
          pagination: null,
          filterQuery: null,
        };
      }),
    );
  }
}
