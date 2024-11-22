import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
  private awsClientS3 : AWS.S3;
  private awsClientSQS : AWS.SQS;
  constructor(){
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    })

    this.awsClientS3 = new AWS.S3();
    this.awsClientSQS = new AWS.SQS();
  }
  async create(body: any, files: Express.Multer.File[]) {
    try {
      // safe parse the json
      const payload = JSON.parse(body.payload);
      if (!payload.title || !payload.description)  throw new BadRequestException('Title and description are required');
      const videoFile = files[0];
      const thumbnailFile = files[1];
      
      // upload video
      const videoUploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${videoFile.originalname}`,
        Body: videoFile.buffer
      }

    } catch (error) {
      
    }
    return 'This action adds a new upload';
  }

  findAll() {
    return `This action returns all uploads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
