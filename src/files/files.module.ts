import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { MinioModule } from 'nestjs-minio-client';

import { AppConfigDto } from '@config/app.dto';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService<AppConfigDto, true>) => ({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: configService.get('files.uploadLimits.fileSize', {
            infer: true,
          }),
          files: configService.get('files.uploadLimits.filesCount', {
            infer: true,
          }),
        },
      }),
      inject: [ConfigService],
    }),
    MinioModule.registerAsync({
      useFactory: (configService: ConfigService<AppConfigDto, true>) => ({
        endPoint: configService.get('files.endPoint', { infer: true }),
        port: configService.get('files.port', { infer: true }),
        useSSL: configService.get('files.useSSL', { infer: true }),
        accessKey: configService.get('files.accessKey', { infer: true }),
        secretKey: configService.get('files.secretKey', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [],
})
export class FilesModule {}
