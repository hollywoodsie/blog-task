import { Expose } from 'class-transformer';

export class ReqParamsDto {
  @Expose()
  id: number;
}
