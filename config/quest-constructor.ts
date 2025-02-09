import { IsInt, IsPositive } from 'class-validator';

export class QuestConstructorConfigDto {
  @IsInt()
  @IsPositive()
  maxTimeLimit = 60 * 60 * 2;

  @IsInt()
  @IsPositive()
  maxScenesCount = 100;

  @IsInt()
  @IsPositive()
  maxInteractionsCount = 500;
}
