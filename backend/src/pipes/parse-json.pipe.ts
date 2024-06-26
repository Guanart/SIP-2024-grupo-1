import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed');
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Invalid JSON');
    }
  }
}