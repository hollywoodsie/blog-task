import { Expose } from 'class-transformer';

import { IsInt, IsOptional } from 'class-validator';

export class GetPaginatedPostsDto {
  @Expose()
  @IsInt()
  @IsOptional()
  page: number;

  @Expose()
  @IsInt()
  @IsOptional()
  pageSize: number;
}
