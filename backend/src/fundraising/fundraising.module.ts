import { Module } from '@nestjs/common';
import { FundraisingService } from './fundraising.service';
import { FundraisingController } from './fundraising.controller';
import { MercadoPagoService } from 'src/mercado-pago/mercado-pago.service';
import { PrismaService } from 'src/database/prisma.service';
import { CollectionService } from 'src/collection/collection.service';
import { TokenService } from 'src/token/token.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [FundraisingController],
  providers: [
    FundraisingService,
    MercadoPagoService,
    PrismaService,
    CollectionService,
    TokenService,
  ],
})
export class FundraisingModule {}
