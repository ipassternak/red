import { randomUUID } from 'node:crypto';
import * as path from 'node:path';
import internal from 'node:stream';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { StreamableFileOptions } from '@nestjs/common/file-stream/interfaces';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';

import { AppConfigDto } from '@config/app.dto';
import { AuthAccessPayload } from '@lib/types/auth';
import { createAppException } from '@lib/utils/exception';

import { FileDataDto, ServeFileParamsDto } from './dto/files.dto';

const UploadFileException = createAppException(
  'Failed to upload file to storage',
  HttpStatus.INTERNAL_SERVER_ERROR,
  'FILES_ERR_UPLOAD_FILE',
);

const ServeFileException = createAppException(
  'Failed to serve file from storage',
  HttpStatus.INTERNAL_SERVER_ERROR,
  'FILES_ERR_SERVE_FILE',
);

const FILE_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  default: '',
};

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly configService: ConfigService<AppConfigDto, true>,
    private readonly minioClient: MinioService,
  ) {}

  async updloadFile(
    file: Express.Multer.File,
    access: AuthAccessPayload,
  ): Promise<FileDataDto> {
    const bucketName = this.configService.get('files.bucketName', {
      infer: true,
    });
    const fileId = randomUUID();
    const fileExtension =
      FILE_EXTENSION_MAP[file.mimetype] ?? FILE_EXTENSION_MAP.default;
    const publickFolder = this.configService.get('files.publicFolder', {
      infer: true,
    });
    const filePath = path.join(publickFolder, `${fileId}${fileExtension}`);
    await this.minioClient.client
      .putObject(bucketName, filePath, file.buffer, {
        'Content-Type': file.mimetype,
        'X-Filename': encodeURI(file.originalname),
        'X-Content-Size': file.size.toString(),
        'X-File-Id': fileId,
      })
      .catch((error: unknown): never => {
        this.logger.fatal({
          service: `${FilesService.name}.uploadFile`,
          error,
          context: { filePath },
        });
        throw new UploadFileException();
      });
    const fileData = new FileDataDto({
      id: fileId,
      mimeType: file.mimetype,
      size: file.size,
      filePath,
      originalName: file.originalname,
      ownerId: access.sub,
      createdAt: new Date().toISOString(),
    });
    return fileData;
  }

  async serveFile(
    params: ServeFileParamsDto,
  ): Promise<{ stream: internal.Readable; meta: StreamableFileOptions }> {
    const bucketName = this.configService.get('files.bucketName', {
      infer: true,
    });
    const publicFolder = this.configService.get('files.publicFolder', {
      infer: true,
    });
    const fileId = params.id;
    const fileExtension =
      FILE_EXTENSION_MAP[params.mimeType] ?? FILE_EXTENSION_MAP.default;
    const filePath = path.join(publicFolder, `${fileId}${fileExtension}`);
    try {
      const stats = await this.minioClient.client.statObject(
        bucketName,
        filePath,
      );
      const meta: StreamableFileOptions = {
        type: params.mimeType,
        disposition: 'inline',
        length: stats.size,
      };
      const stream = await this.minioClient.client.getObject(
        bucketName,
        filePath,
      );
      stream.on('error', (error) => {
        this.logger.fatal({
          service: `${FilesService.name}.serveFile`,
          error,
          context: {
            id: params.id,
            filePath,
          },
        });
      });
      return { stream, meta };
    } catch (error: unknown) {
      this.logger.fatal({
        service: `${FilesService.name}.serveFile`,
        error,
        context: {
          id: params.id,
          filePath,
        },
      });
      throw new ServeFileException();
    }
  }
}
