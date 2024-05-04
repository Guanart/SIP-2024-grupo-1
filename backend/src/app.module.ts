import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { SeedModule } from './seed/seed.module';
import { FundraisingModule } from './fundraising/fundraising.module';
import { CollectionModule } from './collection/collection.module';
import { EventModule } from './event/event.module';
import { PlayerModule } from './player/player.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    UserModule,
    WalletModule,
    SeedModule,
    MercadoPagoModule,
    FundraisingModule,
    CollectionModule,
    EventModule,
    PlayerModule,
    TransactionModule,
  ],
})
export class AppModule {}
