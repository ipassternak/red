import { ApiProperty } from '@nestjs/swagger';
import { QuestInteractionType } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { ListResponseDto, ResponseDto } from '@lib/dto/common.dto';

// Requests
export class CreateSceneDataDto {
  @ApiProperty({
    description: 'The label of the scene',
    minLength: 1,
    maxLength: 64,
  })
  @IsString()
  @Length(1, 64)
  label: string;

  @ApiProperty({
    description: 'The width of the scene in pixels',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  width: number;

  @ApiProperty({
    description: 'The height of the scene in pixels',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  height: number;
}

export class UpdateSceneDataDto {
  @ApiProperty({
    required: false,
    description: 'The label of the scene',
    minLength: 1,
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  label?: string;

  @ApiProperty({
    required: false,
    description: 'The width of the scene in pixels',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  width?: number;

  @ApiProperty({
    required: false,
    description: 'The height of the scene in pixels',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  height?: number;
}

export class QuestionInteractionData {
  @ApiProperty({
    description: 'The template of the question',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  template: string;

  @ApiProperty({
    description: 'The settings of the question in JSON format',
  })
  @IsJSON()
  settings: string;

  @ApiProperty({
    description: 'The correct answers for the question',
    minLength: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  answers: string[];
}

export class TransitionInteractionData {
  @ApiProperty({
    description: 'The ID of the target scene',
  })
  @IsString()
  @IsNotEmpty()
  sceneId: string;
}

export class CreateInteractionDataDto {
  @ApiProperty({ description: 'The ID of the scene' })
  @IsString()
  @IsNotEmpty()
  questSceneId: string;

  @ApiProperty({
    description: 'The penalty for the task wrong answer in seconds',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  penalty: number;

  @ApiProperty({
    description: 'The normalized value of x-coordinate',
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  dx: number;

  @ApiProperty({
    description: 'The normalized value of y-coordinate',
    minimum: 0,
    maximum: 1,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  dy: number;

  @ApiProperty({
    description: 'The radius of the interaction in pixels',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  radius: number;

  @ApiProperty({
    required: false,
    description: 'The label of the interaction',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @ApiProperty({
    description: 'The type of the interaction',
    enum: QuestInteractionType,
  })
  @IsEnum(QuestInteractionType)
  type: QuestInteractionType;

  @ApiProperty({
    required: false,
    description: 'The data of the question interaction',
    type: QuestionInteractionData,
  })
  @IsOptional()
  @Type(() => QuestionInteractionData)
  @ValidateNested()
  question?: QuestionInteractionData;

  @ApiProperty({
    required: false,
    description: 'The data of the transition interaction',
    type: [TransitionInteractionData],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => TransitionInteractionData)
  @ValidateNested({ each: true })
  transitions?: TransitionInteractionData[];
}

export class UpdateInteractionDataDto {
  @ApiProperty({
    required: false,
    description: 'The penalty for the task wrong answer in seconds',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  penalty: number;

  @ApiProperty({
    required: false,
    description: 'The normalized value of x-coordinate',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  dx: number;

  @ApiProperty({
    required: false,
    description: 'The normalized value of y-coordinate',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  dy: number;

  @ApiProperty({
    required: false,
    description: 'The radius of the interaction in pixels',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  radius: number;

  @ApiProperty({
    required: false,
    description: 'The label of the interaction',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @ApiProperty({
    required: false,
    description: 'The data of the question interaction',
    type: QuestionInteractionData,
  })
  @IsOptional()
  @Type(() => QuestionInteractionData)
  @ValidateNested()
  question: QuestionInteractionData;
}

// Responses
export class QuestMetadataResponseDto extends ResponseDto {
  @ApiProperty({ description: 'The total number of the quest scenes' })
  totalScenes: number;

  @ApiProperty({ description: 'The total number of the quest interactions' })
  totalInteractions: number;

  @ApiProperty({ description: 'The total number of the quest questions' })
  totalQuestions: number;
}

export class SceneResponseDto extends ResponseDto {
  @ApiProperty({ description: 'The ID of the scene' })
  id: string;

  @ApiProperty({ description: 'The ID of the quest' })
  questId: string;

  @ApiProperty({ description: 'The label of the scene' })
  label: string;

  @ApiProperty({ description: 'The width of the scene in pixels' })
  width: number;

  @ApiProperty({ description: 'The height of the scene in pixels' })
  height: number;

  @ApiProperty({ description: 'The last update date of the scene' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the scene' })
  createdAt: Date;
}

export class SceneListResponseDto extends ListResponseDto<SceneResponseDto> {
  @ApiProperty({ type: SceneResponseDto, isArray: true })
  @Type(() => SceneResponseDto)
  data: SceneResponseDto[];
}

export class SceneWithMetadataResponseDto extends ResponseDto {
  @ApiProperty({ type: SceneResponseDto })
  @Type(() => SceneResponseDto)
  data: SceneResponseDto;

  @ApiProperty({ type: QuestMetadataResponseDto })
  @Type(() => QuestMetadataResponseDto)
  meta: QuestMetadataResponseDto;
}

export class InteractionResponseDto extends ResponseDto {
  @ApiProperty({ description: 'The ID of the interaction' })
  id: string;

  @ApiProperty({ description: 'The ID of the scene' })
  questSceneId: string;

  @ApiProperty({ description: 'The ID of the quest' })
  questId: string;

  @ApiProperty({
    description: 'The penalty for the task wrong answer in seconds',
  })
  penalty: number;

  @ApiProperty({
    description: 'The normalized value of x-coordinate',
  })
  dx: number;

  @ApiProperty({
    description: 'The normalized value of y-coordinate',
  })
  dy: number;

  @ApiProperty({ description: 'The radius of the interaction in pixels' })
  radius: number;

  @ApiProperty({
    required: false,
    description: 'The label of the interaction',
    type: String,
  })
  label: string | null;

  @ApiProperty({
    description: 'The type of the interaction',
    enum: QuestInteractionType,
  })
  type: QuestInteractionType;

  @Exclude()
  template: string | null;

  @Exclude()
  settings: string | null;

  @Exclude()
  answers: string | null;

  @ApiProperty({ description: 'The last update date of the interaction' })
  updatedAt: Date;

  @ApiProperty({ description: 'The creation date of the interaction' })
  createdAt: Date;

  @ApiProperty({ required: false, type: QuestionInteractionData })
  @Expose()
  @Transform(({ obj }: { obj: InteractionResponseDto }) => {
    if (obj.question) return obj.question;
    if (obj.type === QuestInteractionType.QUESTION)
      return {
        template: obj.template,
        settings: obj.settings,
        answers: <string[]>JSON.parse(<string>(<unknown>obj.answers ?? '[]')),
      };
  })
  question?: QuestionInteractionData;

  @ApiProperty({ required: false, type: TransitionInteractionData })
  @Expose()
  @Transform(({ obj }: { obj: InteractionResponseDto }) => {
    if (obj.type === QuestInteractionType.TRANSITION)
      return obj.transitions?.map((t) => ({ sceneId: t.sceneId }));
  })
  transitions?: TransitionInteractionData[];
}

// eslint-disable-next-line max-len
export class InteractionListResponseDto extends ListResponseDto<InteractionResponseDto> {
  @ApiProperty({ type: InteractionResponseDto, isArray: true })
  @Type(() => InteractionResponseDto)
  data: InteractionResponseDto[];
}

export class InteractionWithMetadataResponseDto extends ResponseDto {
  @ApiProperty({ type: InteractionResponseDto })
  @Type(() => InteractionResponseDto)
  data: InteractionResponseDto;

  @ApiProperty({ type: QuestMetadataResponseDto })
  @Type(() => QuestMetadataResponseDto)
  meta: QuestMetadataResponseDto;
}
