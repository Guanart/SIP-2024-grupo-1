import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user-dto';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });

    await this.walletService.create(user.id);

    return user ? User.fromObject(user) : null;
  }

  async findOne(auth0_id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        auth0_id,
        active: true,
      },
      include: {
        player: {
          include: { game: true, rank: true },
        },
        wallet: {
          include: {
            transactions: true,
            token_wallet: {
              include: {
                token: {
                  include: {
                    collection: {
                      include: {
                        fundraising: {
                          include: {
                            event: true,
                            player: { include: { user: true } },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return user ? User.fromObject(user) : null;
  }

  async update({
    username,
    // country,
    avatar,
    auth0_id,
    active,
  }: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        auth0_id,
      },
      data: { username, avatar, active },
    });

    // TODO: actualizar relación USER_COUNTRY
    // console.log(country);

    return updatedUser ? User.fromObject(updatedUser) : null;
  }

  async delete({ auth0_id }: DeleteUserDto): Promise<User> {
    const active = false;

    const deletedUser = await this.prisma.user.update({
      where: {
        auth0_id,
        active: true,
      },
      data: { active },
    });

    return deletedUser ? User.fromObject(deletedUser) : null;
  }

  async isActive(auth0_id: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        auth0_id,
      },
    });

    return user ? user.active : null;
  }
}
