import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService],
})
export class TransactionModule {}