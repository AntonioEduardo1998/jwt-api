import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Deposit, Prisma } from '@prisma/client';

@Injectable()
export class DepositService {
  constructor(private prisma: PrismaService) {}

  async deposit(
    depositoWhereUniqueInput: Prisma.DepositWhereUniqueInput,
  ): Promise<Deposit | null> {
    return this.prisma.deposit.findUnique({
      where: depositoWhereUniqueInput,
    });
  }

  async findDepositById(id: number): Promise<Deposit | null> {
    return this.prisma.deposit.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async deposits(): Promise<Deposit[]> {
    return this.prisma.deposit.findMany({
      include: {
        products: true,
      },
    });
  }

  async createDeposit(data: Prisma.DepositCreateInput): Promise<Deposit> {
    return this.prisma.deposit.create({
      data,
    });
  }
}
