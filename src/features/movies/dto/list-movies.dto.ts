import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMoviesDto {
  @IsOptional() @IsString() @ApiPropertyOptional() q?: string;
  @IsOptional() @Type(() => Number) @IsInt() @ApiPropertyOptional() genreId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @ApiPropertyOptional({ default: 1 }) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @ApiPropertyOptional({ default: 20 }) limit = 20;
  @IsOptional() @IsIn(['popularity','release_date','avg_rating']) @ApiPropertyOptional({ default: 'popularity' }) sort: any = 'popularity';
  @IsOptional() @IsIn(['asc','desc']) @ApiPropertyOptional({ default: 'desc' }) order: any = 'desc';
}
