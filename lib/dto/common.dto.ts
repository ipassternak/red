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

class ListResponseMetaDto {
  @ApiProperty({ description: 'Total count' })
  total: number;
}

export abstract class ListResponseDto<T> {
  abstract data: T[];

  @ApiProperty({ type: ListResponseMetaDto })
  meta: ListResponseMetaDto;

  constructor(partia: Partial<ListResponseDto<T>>) {
    Object.assign(this, partia);
  }
}
