import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [AccountController],
  providers: [AccountService, PrismaService],
})
export class AccountModule {}
