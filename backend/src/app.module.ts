import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    UserModule,
    WalletModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
