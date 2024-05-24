import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { Auth0Service } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService, PrismaService, WalletService, Auth0Service],
})
export class UserModule {}
