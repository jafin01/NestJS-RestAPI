import { Controller, Get, Param, Res } from '@nestjs/common';
import { UsersService } from './user.service';
import { Response } from 'express';
import { isValidObjectId, ObjectId } from 'mongoose';

@Controller('api/users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  // GET /api/users
  @Get()
  async GetAllUsers(@Res({ passthrough: true }) res: Response) {
    try {
      const users = await this.usersServices.findAllUsers();
      if (users.length < 1) {
        throw new Error('No users found !!');
      }
      return users;
    } catch (error) {
      res.status(500);
      return {
        error: error.message,
        stack: error.stack,
      };
    }
  }

  // GET /api/users/:id
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
}
