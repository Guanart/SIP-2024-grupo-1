import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { PermissionsGuard } from './auth/permissions.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['buy:tokens'])
  @Get('/user')
  getUserHello(): string {
    return this.appService.getUserHello();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['create:fundraisings'])
  @Get('/player')
  getPlayerHello(): string {
    return this.appService.getPlayerHello();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @SetMetadata('permissions', ['create:events'])
  @Get('/admin')
  getAdminHello(): string {
    return this.appService.getAdminHello();
  }
}
