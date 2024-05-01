import { Module } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { PrismaService } from '../database/prisma.service';
import { CollectionService } from 'src/collection/collection.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CollectionService, PrismaService, TokenService],
})
export class CollectionModule {}
