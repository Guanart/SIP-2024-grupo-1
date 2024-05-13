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
    InternalServerErrorException,
  } from '@nestjs/common';
  import { VerificationRequestService } from './verification-request.service';
  import { VerificationRequest } from './verification-request.entity';
  import { CreateVerificationRequestDto } from './dto';
  import { UpdateVerificationRequestDto } from './dto/update-verificationRequest.dto';

@Controller('verification-request')
export class VerificationRequestController {
    constructor(private verificationRequestService: VerificationRequestService) {}
    //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['create:Users'])
    @Post()
    async create(@Body() newVerificationRequest: CreateVerificationRequestDto): Promise<string> {
      try {
        const verificationRequest: VerificationRequest = await this.verificationRequestService.create(newVerificationRequest);
  
        if (!verificationRequest) {
          throw new BadRequestException();
        }
        return JSON.stringify({
          message: `Verification Request ${newVerificationRequest.user_id} created`,
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
    async findOne(
      @Param('wallet_id') user_id: number,
      @Param('token_id') createdAt: Date, 
    ): Promise<string> {
      try {
        const verificationRequest: VerificationRequest = await this.verificationRequestService.findOne(user_id, createdAt);
  
        if (!verificationRequest) {
          throw new NotFoundException(`Verification Request ${user_id}, ${createdAt} not found`);
        }
  
        return JSON.stringify({
          message: `Transaction ${user_id}, ${createdAt} found`,
          verificationRequest,
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
    async update(@Body() updatedVerificationRequest: UpdateVerificationRequestDto): Promise<string> {
      try {
        let verificationRequest: VerificationRequest = await this.verificationRequestService.findOne(
          updatedVerificationRequest.user_id,
          updatedVerificationRequest.createdAt,
        );
  
        if (!verificationRequest) {
          throw new NotFoundException(`Transaction 
          ${updatedVerificationRequest.id} not found`);
        }
  
        verificationRequest = await this.verificationRequestService.update(updatedVerificationRequest);
  
        if (!verificationRequest) {
          throw new BadRequestException();
        }
  
        return JSON.stringify({
          message: `Transaction 
          ${updatedVerificationRequest.id} updated`,
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
