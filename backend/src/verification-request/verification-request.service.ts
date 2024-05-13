import { Injectable } from '@nestjs/common';
import { VerificationRequest } from './verification-request.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateVerificationRequestDto } from './dto';
import { UpdateVerificationRequestDto } from './dto/update-verificationRequest.dto';

@Injectable()
export class VerificationRequestService {

    constructor(private prisma: PrismaService) {}
  
    async create(verificationRequestData: CreateVerificationRequestDto): Promise<VerificationRequest> {
      const verificationRequest = await this.prisma.verificationRequest.create({
          data: verificationRequestData,
      });
      return verificationRequest ? VerificationRequest.fromObject(verificationRequest) : null;
    }
  
    async findOne(user_id: number, createdAt: Date): Promise<VerificationRequest> {
      const verificationRequest = await this.prisma.verificationRequest.findUnique({
        where: {
          id: user_id,
          createdAt,
        },
      });
      return VerificationRequest ? VerificationRequest.fromObject(verificationRequest) : null;
    }
    
    async update({id,status}: UpdateVerificationRequestDto): Promise<VerificationRequest> {
      const updatedVerificationRequest = await this.prisma.verificationRequest.update({
        where: {
          id: id,
        },
        data: {status},
      });
      return VerificationRequest ? VerificationRequest.fromObject(updatedVerificationRequest) : null;
    }
  }
