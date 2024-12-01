import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log("ere");
    return this.postsService.findOne(id);
  }

  @Get()
  findAll(@Body() payload : { userId : string } ) {
    return this.postsService.findAll(payload);
  }
}
