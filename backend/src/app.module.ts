import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './accounts/account.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
