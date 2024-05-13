import { Injectable } from '@nestjs/common';
import { Transaction} from './transaction.entity';
import { PrismaService } from '../database/prisma.service';
import { CreateTransactionDto } from './dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(transactionData: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.prisma.transaction.create({
        data: transactionData,
    });

    return transaction ? Transaction.fromObject(transaction) : null;
}

  async findOne(wallet_id: number,token_id: number, type_id: number, timestamp: Date): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: wallet_id,
        token_id,
        type_id,
        timestamp,
      },
    });

    return Transaction ? Transaction.fromObject(transaction) : null;
  }

  
  async update({wallet_id,token_id, type_id, timestamp}: UpdateTransactionDto): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: {
        id: wallet_id,token_id, type_id, timestamp,
      },
      data: { wallet_id,token_id, type_id, timestamp },
    });

    // TODO: actualizar relación USER_COUNTRY
    // console.log(country);

    return updatedTransaction ? Transaction.fromObject(updatedTransaction) : null;
  }
}