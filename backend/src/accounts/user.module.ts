import { Module } from '@nestjs/common';
import { UserController } from './user';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
