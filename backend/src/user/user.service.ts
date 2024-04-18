import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });

    return user;
  }

  async findOne(auth0_id: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        auth0_id,
      },
    });

    return user;
  }

  async update({
    username,
    // country,
    avatar,
    auth0_id,
  }: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: {
        auth0_id,
      },
      data: { username, avatar },
    });

    // TODO: actualizar relación USER_COUNTRY
    // console.log(country);

    return updatedUser;
  }

  async delete({ auth0_id }: DeleteUserDto): Promise<User> {
    const deletedUser = await this.prisma.user.delete({
      where: {
        auth0_id,
      },
    });

    return deletedUser;
  }
}
