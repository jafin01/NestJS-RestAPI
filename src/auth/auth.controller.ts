/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authServices: AuthService,
    private jwtServices: JwtService,
  ) {}

  // POST /api/auth/register
  @Post('register')
  async createUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() user: CreateUserDto,
  ) {
    const { email, password } = user;
    try {
      const user = await this.authServices.findUserByEmail(email);
      if (user) {
        throw new Error('User already exists !!');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = await this.authServices.saveUser({
        ...req.body,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      res.status(400);
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }

  // POST /api/auth/login
  @Post('login')
  async userAuthentication(@Req() @Body() loginDto: loginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.authServices.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found !!');
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        throw new Error(
          'Authentication failed due to mismatch in username or password',
        );
      }

      const token = this.jwtServices.sign({ id: user._id });

      return {
        user,
        token,
      };
    } catch (error) {
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }
}