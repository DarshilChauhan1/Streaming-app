import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UploadsModule } from './uploads/uploads.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [AuthModule, DatabaseModule, UploadsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
