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
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { VerificationRequestService } from './verification-request.service';
  import { VerificationRequest } from './verification-request.entity';
  import { CreateVerificationRequestDto } from './dto';
  import { UpdateVerificationRequestDto } from './dto/update-verificationRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { ParseJsonPipe } from '../pipes/parse-json.pipe';
import { join } from 'path';
import { promises as fs } from 'fs';

@Controller('verification-request')
export class VerificationRequestController {
    constructor(private verificationRequestService: VerificationRequestService) {}
    //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['create:Users'])
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body('verificationRequest') verificationRequestString: string,
    ) {
      console.log('Received file:', file);
      console.log('Received verificationRequest:', verificationRequestString);
  
      const newVerificationRequest = JSON.parse(verificationRequestString);
  
      if (!file) {
        throw new BadRequestException('File is required');
      }
  
      // Define the directory to save the uploaded files
      const uploadDir = join(__dirname, '..', 'uploads');
      console.log('Upload directory:', uploadDir);
  
      try {
        const verificationRequest = await this.verificationRequestService.createVerificationRequest(newVerificationRequest);

        // Ensure the upload directory exists
        await fs.mkdir(uploadDir, { recursive: true });
  
        const fileExtension = file.originalname.split('.').pop();

        // Define the full path to save the file
        const filePath = join(uploadDir, `${verificationRequest.id}.${fileExtension}`);
  
        // Save the file to the server
        await fs.writeFile(filePath, file.buffer);
  
        // Update the filepath property in the newVerificationRequest
        verificationRequest.filepath = filePath;
        await this.verificationRequestService.updateVerificationRequestFilepath(verificationRequest.id, filePath);

        if (!verificationRequest) {
          throw new BadRequestException();
        }
        return {
          message: `Verification Request ${verificationRequest.id} created`,
          verificationRequest,
        };
      } catch (exception) {
        console.error('Exception:', exception);
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
    
    /*
    @Get("user-id")
    async findOne(
      @Param('user_id') user_id: number,
      @Param('createdAt') createdAt: Date, 
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
    */
    

    @Get()
    async getAllRequests() {
      const verificationRequest = await this.verificationRequestService.getAllRequests();
      return JSON.stringify({
        verificationRequest
      });
    }
  
    //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['update:users'])
    /*
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
    */
  }
