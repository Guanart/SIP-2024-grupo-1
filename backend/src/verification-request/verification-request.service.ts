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

  async updateVerificationRequestFilepath(id: number, filepath: string): Promise<VerificationRequest> {
    const updatedVerificationRequest = await this.prisma.verificationRequest.update({
      where: {
        id: id,
      },
      data: { filepath },
    });
    return updatedVerificationRequest ? VerificationRequest.fromObject(updatedVerificationRequest) : null;
  }

  async getAllRequests(): Promise<VerificationRequest[]> {
    const verificationRequests = await this.prisma.verificationRequest.findMany({
      include: {
        user: true,
        game: true,
        rank: true,
      },
    });
    return verificationRequests.map(verificationRequest => VerificationRequest.fromObject(verificationRequest));
  }

  async findById(id: number): Promise<VerificationRequest | null> {
    const verificationRequest = await this.prisma.verificationRequest.findUnique({
      where: { id },
    });
    return verificationRequest ? VerificationRequest.fromObject(verificationRequest) : null;
  }

  async updateVerificationRequestStatus(updateDto: UpdateVerificationRequestDto): Promise<VerificationRequest | null> {
    const { id, status } = updateDto;
    const updatedVerificationRequest = await this.prisma.verificationRequest.update({
      where: { id },
      data: { status },
    });
    return updatedVerificationRequest ? VerificationRequest.fromObject(updatedVerificationRequest) : null;
  }
  
}