import { Injectable } from '@nestjs/common';
import { VerificationRequest } from './verification-request.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateVerificationRequestDto } from './dto';
import { UpdateVerificationRequestDto } from './dto/update-verificationRequest.dto';

@Injectable()
export class VerificationRequestService {

    constructor(private prisma: PrismaService) {}
  
    async createVerificationRequest(newVerificationRequest: CreateVerificationRequestDto) {
      const {
        user_id,
        game_id,
        rank_id,
        filepath,
        createdAt,
        status,
      } = newVerificationRequest;

      const verificationRequest = await this.prisma.verificationRequest.create({
        data: {
          user_id,
          game_id,
          rank_id,
          filepath,
          createdAt,
          status,
        },
      });
      return verificationRequest ? VerificationRequest.fromObject(verificationRequest) : null;
    }

    async getAllRequests(): Promise<VerificationRequest[]> {
      const verificationRequests = await this.prisma.verificationRequest.findMany({
        where: {
        },
        include: {
          user: true,
          game: true,
          rank: true,
        },
      });
      console.log(verificationRequests);
      return verificationRequests.map(verificationRequest => VerificationRequest.fromObject(verificationRequest));
  }

  /*
  async findOne(user_id: number , createdAt: Date): Promise<VerificationRequest[]> {
    const verificationRequest = await this.prisma.verificationRequest.findUnique({
        where: {
          user_id: user_id, 
          createdAt: createdAt,
        },
    });
    return verificationRequests.map(verificationRequest => VerificationRequest.fromObject(verificationRequest));
}
*/
    
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
