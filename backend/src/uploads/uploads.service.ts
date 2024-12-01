import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as AWS from 'aws-sdk';
import { PrismaService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UploadsService  {
  private awsClientS3 : AWS.S3;
  private awsClientSQS : AWS.SQS;
  constructor(
    private prismaService : PrismaService){
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
      if (!payload.title && !payload.description && !payload.userId)  throw new BadRequestException('Title and description are required');
      const videoFile = files[0];
      const thumbnailFile = files[1];
      
      // upload video
      const videoUploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: videoFile.originalname,
        Expires : 3600 
      }

      // remove extra spaces and special characters in originalname
      const updatedUrl = videoFile.originalname.replace(/[^a-zA-Z0-9.]/g, "_");

      const videoUploadResponse = await this.awsClientS3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}_${updatedUrl}`,
        Body: videoFile.buffer,
      }).promise();

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
          userId : payload.userId,
          status : 'PROCESSING',
          key : videoUploadResponse.Key
        }
      })
      return {
        success : true,
        message: 'Video is processing',
        statusCode : 200
      }

    } catch (error) {
      console.log(error)
       throw error
    }
  }

  async getUploadedFiles(payload : any) {
    try {
      // find the user post 
      const posts = await this.prismaService.post.findFirst({
        where: {
          key : payload.key,
          status: 'PROCESSING'
        }
      })
      if(!posts) {
        return {
          message: 'No posts found',
          statusCode : 200
        }
      }

      // if there is posts then store the m3u8Urls 
      //save the direct payload in the post
      await this.prismaService.post.update({
        where : {
          id : posts.id,
        },
        data : {
          m3u8Url : payload.files,
          status : 'COMPLETED'
        }
      })
      
      return {
        success : true,
        message: 'Video is uploaded',
        statusCode : 200
      }
    } catch (error) {
      console.log(error);
    }
  }
}
