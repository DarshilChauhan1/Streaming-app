import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(private prismaService : PrismaService) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const checkUser = await this.prismaService.user.findUnique({
        where: {
          email: createAuthDto.email
        }
      })
      if(checkUser) throw new BadRequestException('User already exists')
      const user = await this.prismaService.user.create({
        data: {
          email: createAuthDto.email,
          password: createAuthDto.password
        }
      })
      return {
        message: 'User created successfully',
        success : true,
        statusCode : 201,
        data : user
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async login(payload: LoginDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: payload.email
        }
      })
      if(!user) throw new BadRequestException('User does not exist')
      if(user.password !== payload.password) throw new BadRequestException('Invalid password')
      return {
        message: 'Login successful',
        success : true,
        statusCode : 200,
        data : user
      }
    } catch (error) {
      throw error
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
