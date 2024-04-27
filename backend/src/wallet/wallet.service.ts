import { Injectable } from '@nestjs/common';
import { Wallet } from './wallet.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateWalletDto } from './dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
// import { DeleteWalletDto } from './dto/delete-wallet-dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(walletData: CreateWalletDto): Promise<Wallet> {
    const wallet = await this.prisma.wallet.create({
      data: walletData,
    });

    return wallet ? Wallet.fromObject(wallet) : null;
  }

  async findOne(wallet_id: number): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: wallet_id,
      },
      include: {
        user: true,
      },
    });

    return wallet ? Wallet.fromObject(wallet) : null;
  }

  async update({
    wallet_id,
    cbu,
    paypal_id,
  }: UpdateWalletDto): Promise<Wallet> {
    const updatedWallet = await this.prisma.wallet.update({
      where: {
        id: wallet_id,
      },
      data: { cbu, paypal_id },
    });

    return updatedWallet ? Wallet.fromObject(updatedWallet) : null;
  }
}
