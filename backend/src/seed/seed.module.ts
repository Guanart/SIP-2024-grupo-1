import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SeedController],
  providers: [PrismaService],
})
export class SeedModule {}
