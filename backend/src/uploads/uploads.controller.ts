import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, UseGuards, Req } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('uploads')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(@Body() body: any, @UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadsService.create(body, files);
  }

  @Post('uploaded-files')
  getUploadedFiles(@Body() body : any, @Req() req: Request) {
    return this.uploadsService.getUploadedFiles(body, req['userId']);
  }
}