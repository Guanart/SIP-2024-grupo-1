import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Body,
  BadRequestException,
  Put,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { VerificationRequestService } from './verification-request.service';
import { VerificationRequest } from './verification-request.entity';
import { CreateVerificationRequestDto } from './dto';
import { UpdateVerificationRequestDto } from './dto/update-verificationRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { promises as fs, createReadStream } from 'fs';

@Controller('verification-request')
export class VerificationRequestController {
  constructor(private verificationRequestService: VerificationRequestService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('verificationRequest') verificationRequestString: string,
  ) {
    const newVerificationRequest = JSON.parse(verificationRequestString);

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const uploadDir = join(__dirname, '..', 'uploads');
    try {
      const verificationRequest = await this.verificationRequestService.createVerificationRequest(newVerificationRequest);

      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = file.originalname.split('.').pop();
      const filePath = join(uploadDir, `${verificationRequest.id}.${fileExtension}`);
      await fs.writeFile(filePath, file.buffer);

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

  @Get()
  async getAllRequests() {
    const verificationRequest = await this.verificationRequestService.getAllRequests();
    return {
      verificationRequest
    };
  }

  @Get('file/:id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new BadRequestException('Invalid ID format');
      }

      const verificationRequest = await this.verificationRequestService.findById(numericId);

      if (!verificationRequest) {
        throw new NotFoundException(`Verification Request ${id} not found`);
      }

      const filePath = verificationRequest.filepath;
      const file = createReadStream(filePath);

      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${numericId}.${filePath.split('.').pop()}"`,
      });

      file.pipe(res);
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException('Could not download file');
    }
  }

  @Patch(':id')
  async updateRequestStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateVerificationRequestDto
  ) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const updatedVerificationRequest = await this.verificationRequestService.updateVerificationRequestStatus({
        id: numericId,
        status: updateDto.status,
      });

      if (!updatedVerificationRequest) {
        throw new NotFoundException(`Verification Request ${id} not found`);
      }
      console.log(updatedVerificationRequest);
      return {
        message: `Verification Request ${id} updated to ${updateDto.status}`,
        updatedVerificationRequest,
      };
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException('Could not update request status');
    }
  }
}