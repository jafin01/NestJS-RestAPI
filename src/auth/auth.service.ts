import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: mongoose.Model<User>,
  ) {}

  saveUser(user): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const createdUser = await this.UserModel.create({ ...user });
        resolve(createdUser);
      } catch (error) {
        reject(error);
      }
    });
  }

  findUserByEmail(email): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.UserModel.findOne({ email });
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  }
}
