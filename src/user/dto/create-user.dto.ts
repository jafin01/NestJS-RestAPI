import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Length,
  Min,
} from 'class-validator';
import { Role } from '../schemas/user.schema';

export class CreateUserDto {
  @IsInt()
  @Min(10)
  @IsNotEmpty()
  mobileNo: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Please enter correct Role Mentioned' })
  role: Role;
}
