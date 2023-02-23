import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import 'colors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `mongoDB connected to ${connect.connection.host}`.cyan.underline,
    );
    await app.listen(PORT);
    console.log(`app listening to Port ${PORT}`.cyan.underline);
  } catch (error) {
    throw new Error(error.message);
  }
}
bootstrap();
