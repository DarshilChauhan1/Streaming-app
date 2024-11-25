import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class UploadsService  {
  private awsClientS3 : AWS.S3;
  private awsClientSQS : AWS.SQS;
  constructor(private prismaService : PrismaService){
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
      console.log(files);
      console.log(payload);
      if (!payload.title || !payload.description)  throw new BadRequestException('Title and description are required');
      const videoFile = files[0];
      const thumbnailFile = files[1];
      
      // upload video
      const videoUploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${videoFile.originalname}`,
        Expires : 3600 
      }

      console.log("processing")
      const videoUploadResponse = await this.awsClientS3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `videos/${videoFile.originalname}`,
        Body: videoFile.buffer,
      }).promise();
      console.log("uploaded")

      const thumbnailUploadResponse = await this.awsClientS3.upload({
        Bucket: process.env.AWS_BUCKET_NAME_2,
        Key: `thumbnails/${Date.now()}-${thumbnailFile.originalname}`,
        Body: thumbnailFile.buffer,
      }).promise();

      const thumbnailUrl = thumbnailUploadResponse.Location;
      const saveToDB = await this.prismaService.post.create({
        data: {
          title: payload.title,
          description: payload.description,
          thumbnailUrl: thumbnailUploadResponse.Location,
          userId : '6b1b3126-d46e-46ac-910f-bba87fe670ad',
          m3u8Url : ''
        }
      })
      return {
        message: 'Upload successfull',
        data: saveToDB,
        statusCode : 200
      }

    } catch (error) {
       throw error
    }
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
