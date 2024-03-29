import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>,
  ) {}

  findAllUsers(): Promise<User[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.UserModel.find();
        resolve(users);
      } catch (error) {
        reject(error);
      }
    });
  }

  findUserById(id): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.UserModel.findById(id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}
