import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { MAX_POST_TEXT_LENGTH } from '../constants';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_POST_TEXT_LENGTH)
  content: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;
}
