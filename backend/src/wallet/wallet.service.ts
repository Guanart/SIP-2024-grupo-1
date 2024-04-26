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

    console.log(typeof walletData.user_id);

    return wallet ? Wallet.fromObject(wallet) : null;
  }

  async findOne(user_id: number): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        user_id,
      },
      include: {
        user: true,
      },
    });

    console.log(wallet);

    return wallet ? Wallet.fromObject(wallet) : null;
  }

  async update({ user_id, cbu, paypal_id }: UpdateWalletDto): Promise<Wallet> {
    const updatedWallet = await this.prisma.wallet.update({
      where: {
        user_id,
      },
      data: { user_id, cbu, paypal_id },
    });

    return updatedWallet ? Wallet.fromObject(updatedWallet) : null;
  }

  async delete({ id }: DeleteWalletDto): Promise<Wallet> {
    const deletedWallet = await this.prisma.wallet.update({
      where: {
        id,
      },
      data: { active: false },
    });

    return deletedWallet ? Wallet.fromObject(deletedWallet) : null;
  }
}
