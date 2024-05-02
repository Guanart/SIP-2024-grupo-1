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
  import { TransactionService } from './transaction.service';
  import { Transaction } from './transaction.entity';
  import { CreateTransactionDto } from './dto';
  // import { PermissionsGuard } from '../auth/permissions.guard';
  // import { AuthGuard } from '../auth/auth.guard';
  import { UpdateTransactionDto } from './dto/update-transaction.dto';
  
  @Controller('user')
  export class TransactionController {
    constructor(private transactionService: TransactionService) {}
  
    //? Esto está comentado para que no pida permisos (access_token). Si se prueba desde el front, si se pueden descomentar esas anotaciones
    // @UseGuards(AuthGuard, PermissionsGuard)
    // @SetMetadata('permissions', ['create:Users'])
    @Post()
    async create(@Body() newTransaction: CreateTransactionDto): Promise<string> {
      try {
        const transaction: Transaction = await this.transactionService.create(newTransaction);
  
        if (!transaction) {
          throw new BadRequestException();
        }
  
        return JSON.stringify({
          message: `Transaction ${newTransaction.wallet_id} created`,
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
      @Param('wallet_id') wallet_id: number,
      @Param('token_id') token_id: number, 
      @Param('type_id') type_id: number, 
      @Param('timestamp') timestamp: Date
    ): Promise<string> {
      try {
        const transaction: Transaction = await this.transactionService.findOne(wallet_id,token_id, type_id, timestamp);
  
        if (!transaction) {
          throw new NotFoundException(`Transaction ${wallet_id}, ${token_id}, ${type_id}, ${timestamp} not found`);
        }
  
        return JSON.stringify({
          message: `Transaction ${wallet_id}, ${token_id}, ${type_id}, ${timestamp}  found`,
          transaction,
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
    async update(@Body() updatedTransaction: UpdateTransactionDto): Promise<string> {
      try {
        let transaction: Transaction = await this.transactionService.findOne(
          updatedTransaction.wallet_id,
          updatedTransaction.token_id,
          updatedTransaction.type_id,
          updatedTransaction.timestamp,
        );
  
        if (!transaction) {
          throw new NotFoundException(`Transaction 
          ${updatedTransaction.wallet_id}, 
          ${updatedTransaction.token_id},
          ${updatedTransaction.type_id}, 
          ${updatedTransaction.timestamp} not found`);
        }
  
        transaction = await this.transactionService.update(updatedTransaction);
  
        if (!transaction) {
          throw new BadRequestException();
        }
  
        return JSON.stringify({
          message: `Transaction 
          ${updatedTransaction.wallet_id}, 
          ${updatedTransaction.token_id},
          ${updatedTransaction.type_id}, 
          ${updatedTransaction.timestamp} updated`,
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
  