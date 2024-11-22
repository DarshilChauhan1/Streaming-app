import { Controller, Post, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(@Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadsService.create(body, files);
  }
}