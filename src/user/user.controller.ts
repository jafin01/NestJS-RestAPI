import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { Response } from 'express';
import { isValidObjectId, ObjectId } from 'mongoose';

@Controller('api/users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  // GET /users
  @Get()
  async GetAllUsers(@Res({ passthrough: true }) res: Response) {
    try {
      const users = await this.usersServices.findAllUsers();
      return users;
    } catch (error) {
      res.status(500);
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }

  // GET /users/:id
  @Get(':id')
  async getUserById(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: ObjectId,
  ) {
    try {
      if (!isValidObjectId(id)) {
        throw new Error('Object Id invalid !!');
      }

      const user = await this.usersServices.findUserById(id);
      if (!user) {
        throw new Error('User not found !!');
      }

      return user;
    } catch (error) {
      res.status(400);
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }

  // POST /users
  @Post()
  async createUser(
    @Res({ passthrough: true }) res: Response,
    @Body() user: CreateUserDto,
  ) {
    const { email } = user;
    try {
      const user = await this.usersServices.findUserByEmail(email);
      if (user) {
        throw new Error('User already exists !!');
      }

      const response = await this.usersServices.saveUser(user);
      return response;
    } catch (error) {
      // const statusCode = res.statusCode ? res.statusCode : 500;
      // res.status(statusCode);
      res.status(400);
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
