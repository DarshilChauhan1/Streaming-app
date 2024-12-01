import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService : JwtService,
    private prismaService : PrismaService) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const checkUser = await this.prismaService.user.findUnique({
        where: {
          email: createAuthDto.email
        }
      })
      if(checkUser) throw new BadRequestException('User already exists')

      const hashedPassword = await bcrypt.hash(createAuthDto.password, 10)
      const user = await this.prismaService.user.create({
        data: {
          ...createAuthDto,
          password: hashedPassword
        }
      })
      const { password, ...userData } = user
      return {
        message: 'User created successfully',
        success : true,
        statusCode : 201,
        data : userData
      }
    } catch (error) {
      throw error
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
      // compare the password
      const isPasswordValid = await bcrypt.compare(payload.password, user.password)

      if(!isPasswordValid) throw new BadRequestException('Invalid password')
      const tokens = await this.generateTokens(user.id)

      const { password, ...userData } = user
      
      return {
        message: 'Login successful',
        success : true,
        statusCode : 200,
        data : {
          userData,
          tokens
        }
      }
    } catch (error) {
      throw error
    }
  }

  async generateTokens(userId : string){
    const payload = { userId }
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '10h', secret : process.env.JWT_SECRET} );
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn : '30d', secret : process.env.JWT_REFRESH_SECRET});
    return {
      accessToken,
      refreshToken
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
