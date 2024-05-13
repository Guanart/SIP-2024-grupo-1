import { Module } from '@nestjs/common';
import { VerificationRequestController } from './verification-request.controller';
import { VerificationRequestService } from './verification-request.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [VerificationRequestController],
  providers: [VerificationRequestService, PrismaService]
})
export class VerificationRequestModule {}
