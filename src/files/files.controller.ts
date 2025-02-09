import {
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthAccessPayload } from '@lib/types/auth';
import { createAppException } from '@lib/utils/exception';
import { JwtAccessGuard } from '@src/auth/guards/jwt-access.guard';

import { FileDataDto, ServeFileParamsDto } from './dto/files.dto';
import { FilesService } from './files.service';

const InvalidFileException = createAppException(
  'File too large or has invalid mime type',
  HttpStatus.BAD_REQUEST,
  'FILES_ERR_INVALID_FILE',
);

@Controller('/api/files')
@ApiTags('Files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAccessGuard)
  @Post('/upload')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file' })
  @ApiOkResponse({ type: FileDataDto })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/jpeg|image\/png|video\/mp4|video\/webm/,
        })
        .build({
          exceptionFactory: () => new InvalidFileException(),
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    file: Express.Multer.File,
    @Req() request: { accessPayload: AuthAccessPayload },
  ): Promise<FileDataDto> {
    const { accessPayload } = request;
    return await this.filesService.updloadFile(file, accessPayload);
  }

  @Get('/serve')
  @ApiOperation({ summary: 'Serve file' })
  @ApiOkResponse({ description: 'Served file' })
  async serveFile(
    @Query() params: ServeFileParamsDto,
  ): Promise<StreamableFile> {
    const { stream, meta } = await this.filesService.serveFile(params);
    return new StreamableFile(stream, meta);
  }
}
