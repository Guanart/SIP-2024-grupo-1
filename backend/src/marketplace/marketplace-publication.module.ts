import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MarketplacePublicationController } from './marketplace-publication.controller';
import { MarketplacePublicationService } from './marketplace-publication.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [MarketplacePublicationController],
  providers: [MarketplacePublicationService, PrismaService],
})
export class MarketplacePublicationModule {}
