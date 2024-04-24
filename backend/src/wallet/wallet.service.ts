import { Injectable } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateWalletDto } from './dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { DeleteWalletDto } from './dto/delete-wallet-dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(walletData: CreateWalletDto): Promise<Wallet> {
    const wallet = await this.prisma.wallet.create({
      data: walletData,
    });

    return wallet;
  }

  async findOne(user_id: number): Promise<Wallet> {
    const wallet: Wallet = await this.prisma.wallet.findUnique({
      where: {
        user_id,
      },
    });

    return wallet;
  }

  
  async update({
    user_id
  }: UpdateWalletDto): Promise<Wallet> {
    const updatedWallet = await this.prisma.wallet.update({
      where: {
        user_id,
      },
      data: { user_id },
    });

    // TODO: actualizar relación USER_COUNTRY
    // console.log(country);

    return updatedWallet;
  }

  async delete({ id }: DeleteWalletDto): Promise<Wallet> {
    const active = false;

    const deletedWallet = await this.prisma.wallet.update({
      where: {
        id,
      },
      data: { active },
    });

    return deletedWallet;
  }
}