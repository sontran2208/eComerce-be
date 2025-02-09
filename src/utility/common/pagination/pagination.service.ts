import { Injectable } from '@nestjs/common';
import { PaginationResult } from './pagination.interface';

@Injectable()
export class PaginationService {
  getPaginationMeta<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginationResult<T> {
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
