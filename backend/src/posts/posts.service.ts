import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async findAll(payload : { userId : string }) {
    console.log(payload);
    try {
      const { userId } = payload;
      const posts = await this.prismaService.post.findMany({
        where: {
          userId,
          status : 'COMPLETED'
        }
      })
      if(!posts.length){
        return {
          message: 'No posts found',
          statusCode : 200,
          success : false
        }
      }
      return {
        message: 'Posts found',
        data : posts,
        success : true,
        statusCode : 200
      }
    } catch (error) {
      console.log(error);
      return {
        message: 'Internal server error',
        statusCode : 500,
        success : false
      }
    }
  }

  async findOne(id: string) {
    try {
      console.log(id);
      const findPost = await this.prismaService.post.findUnique({
        where : {
          id : id,
          status : 'COMPLETED'
        }
      })
      if(!findPost){
        return {
          message: 'Post not found',
          statusCode : 200,
          success : false
        }
      }
      return {
        message: 'Post found',
        data : findPost,
        success : true,
        statusCode : 404
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
