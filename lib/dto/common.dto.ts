import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsEnum, IsInt, IsPositive, Max } from 'class-validator';

export abstract class PageableDto {
  @ApiProperty({ description: 'Page number', minimum: 1, default: 1 })
  @IsInt()
  @IsPositive()
  page: number;

  @ApiProperty({ description: 'Page size', default: 10, maximum: 100 })
  @IsInt()
  @IsPositive()
  @Max(100)
  pageSize: number;

  abstract sortColumn: unknown;

  @ApiProperty({
    description: 'Sort order',
    enum: Prisma.SortOrder,
    default: Prisma.SortOrder.asc,
  })
  @IsEnum(Prisma.SortOrder)
  sortOrder: Prisma.SortOrder;
}

export class ResponseDto {
  constructor(data: Partial<ResponseDto>) {
    Object.assign(this, data);
  }
}

class ListResponseMetaDto {
  @ApiProperty({ description: 'Total count' })
  total: number;
}

export abstract class ListResponseDto<T> extends ResponseDto {
  abstract data: T[];

  @ApiProperty({ type: ListResponseMetaDto })
  meta: ListResponseMetaDto;
}
