import {
  Controller,
  NotFoundException,
  // UseGuards,
  // SetMetadata,
  BadRequestException,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
// import { PermissionsGuard } from '../auth/permissions.guard';
// import { AuthGuard } from '../auth/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
  // @UseGuards(AuthGuard, PermissionsGuard)
  // @SetMetadata('permissions', ['update:players'])
  @Get()
  async update(): Promise<string> {
    try {
      const data = await this.adminService.getData();

      return JSON.stringify({
        message: `Admin data`,
        data,
      });
    } catch (exception) {
      console.log(exception);
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
