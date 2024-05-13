import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Body,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  Put,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user-dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['create:Users'])
  @Post()
  async create(@Body() newUser: CreateUserDto): Promise<string> {
    try {
      const isActive: boolean = await this.userService.isActive(
        newUser.auth0_id,
      );

      let user = null;

      if (isActive === null) {
        user = await this.userService.create(newUser);
      } else if (isActive === false) {
        //? Si un usuario que había eliminado su cuenta, vuelve a iniciar sesión, se la vuelve a habilitar.
        user = await this.userService.update({ ...newUser, active: true });
      }

      if (!user) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `User ${newUser.auth0_id} created`,
        user,
      });
    } catch (exception) {
      if (exception instanceof BadRequestException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['read:users'])
  @Get('/:auth0_id')
  async findOne(@Param('auth0_id') auth0_id: string): Promise<string> {
    try {
      const user: User = await this.userService.findOne(auth0_id);

      if (!user) {
        throw new NotFoundException(`User ${auth0_id} not found`);
      }

      return JSON.stringify({
        message: `User ${auth0_id} found`,
        user,
      });
    } catch (exception) {
      if (exception instanceof NotFoundException) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['update:users'])
  @Put('/')
  async update(@Body() updatedUser: UpdateUserDto): Promise<string> {
    try {
      let user: User = await this.userService.findOne(updatedUser.auth0_id);

      if (!user) {
        throw new NotFoundException(`User ${updatedUser.auth0_id} not found`);
      }

      user = await this.userService.update(updatedUser);

      if (!user) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `User ${updatedUser.auth0_id} updated`,
        user,
      });
    } catch (exception) {
      if (
        exception instanceof NotFoundException ||
        exception instanceof BadRequestException
      ) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['delete:users'])
  @Delete('/')
  async delete(@Body() deletedUser: DeleteUserDto): Promise<string> {
    try {
      let user: User = await this.userService.findOne(deletedUser.auth0_id);

      if (!user) {
        throw new NotFoundException(`User ${deletedUser.auth0_id} not found`);
      }

      user = await this.userService.delete(deletedUser);

      if (!user) {
        throw new BadRequestException();
      }

      return JSON.stringify({
        message: `User ${deletedUser.auth0_id} deleted`,
        user,
      });
    } catch (exception) {
      if (
        exception instanceof NotFoundException ||
        exception instanceof BadRequestException
      ) {
        throw exception;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
}
