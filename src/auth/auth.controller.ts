/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';
import * as argon2 from 'argon2';
import { handleError, handleSuccess } from 'src/helpers/returnHelper';
import {
  authenticationFailedException,
  ERROR_PRIORITY,
  userAlreadyExistsException,
  userNotFoundException,
} from '../constants/errorConsts';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authServices: AuthService,
    private jwtServices: JwtService,
  ) {}

  @Post('register')
  async createUser(
    @Res({ passthrough: true }) res: Response,
    @Body() user: CreateUserDto,
  ) {
    const { firstName, lastName, mobileNo, email, password, role } = user;
    try {
      const user = await this.authServices.findUserByEmail(email);
      if (user) {
        throw new Error(userAlreadyExistsException);
      }

      const hashedPassword = await argon2.hash(password);

      const createdUser = await this.authServices.saveUser({
        firstName,
        lastName,
        mobileNo,
        email,
        password: hashedPassword,
        role,
      });
      return handleSuccess(createdUser);
    } catch (error) {
      res.status(400);
      return handleError(error, ERROR_PRIORITY.LOW);
    }
  }

  @Post('login')
  async userAuthentication(@Req() @Body() loginDto: loginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.authServices.findUserByEmail(email);
      if (!user) {
        throw new Error(userNotFoundException);
      }

      const isPasswordMatched = await argon2.verify(user.password, password);
      if (!isPasswordMatched) {
        throw new Error(authenticationFailedException);
      }

      const token = this.jwtServices.sign({ id: user._id });

      return handleSuccess(user, token);
    } catch (error) {
      return handleError(error, ERROR_PRIORITY.LOW);
    }
  }
}
