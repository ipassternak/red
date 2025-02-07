import { IsNotEmpty, IsString } from 'class-validator';

export class DatabaseConfigDto {
  @IsString()
  @IsNotEmpty()
  url: string;
}
