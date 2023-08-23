import { Expose } from 'class-transformer';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetPaginatedPostsDto {
  @Expose()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsInt()
  pageSize: number;
}
