import { Module } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [TokenController],
  providers: [WalletService, PrismaService, TokenService],
})
export class TokenModule {}
