import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
