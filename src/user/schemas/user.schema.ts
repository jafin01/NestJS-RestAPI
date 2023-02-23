import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  MOTHER = 'Mother',
  FATHER = 'Father',
  SON = 'Son',
}

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: Number,
    required: true,
  })
  mobileNo: number;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
