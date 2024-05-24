import { Module } from '@nestjs/common';
import { VerificationRequestController } from './verification-request.controller';
import { VerificationRequestService } from './verification-request.service';
import { PrismaService } from 'src/database/prisma.service';
import { Auth0Service } from 'src/auth/auth.service';

@Module({
  controllers: [VerificationRequestController],
  providers: [VerificationRequestService, PrismaService, Auth0Service]
})
export class VerificationRequestModule {}
