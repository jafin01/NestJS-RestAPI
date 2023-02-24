import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { Request, Response } from 'express';
import { isValidObjectId, ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/users')
export class UsersController {
  constructor(private usersServices: UsersService) {}

  @Get()
  @UseGuards(AuthGuard())
  async GetAllUsers(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      console.log(req.user);
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
