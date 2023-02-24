import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { Request, Response } from 'express';
import { isValidObjectId, ObjectId } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { handleError, handleSuccess } from 'src/helpers/returnHelper';
import {
  ERROR_PRIORITY,
  objectIdInvalidException,
  userNotFoundException,
} from 'src/constants/errorConsts';

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
        throw new Error(userNotFoundException);
      }
      return handleSuccess(users);
    } catch (error) {
      res.status(500);
      return handleError(error.message, ERROR_PRIORITY.HIGH);
    }
  }

  @Get(':id')
  async getUserById(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: ObjectId,
  ) {
    try {
      if (!isValidObjectId(id)) {
        throw new Error(objectIdInvalidException);
      }

      const user = await this.usersServices.findUserById(id);
      if (!user) {
        throw new Error(userNotFoundException);
      }

      // return user;
      return handleSuccess(user);
    } catch (error) {
      res.status(400);
      return handleError(error.message, ERROR_PRIORITY.LOW);
    }
  }
}
