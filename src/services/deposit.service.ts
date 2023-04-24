import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Deposit, Prisma, ProductMovement } from '@prisma/client';

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

  async insertProductInDeposit(params: {
    depositId: number;
    productId: number;
    quantity: number;
    price: number;
    type: 'input' | 'output';
    typeDescription: string;
    document: string;
  }): Promise<ProductMovement> {
    const {
      depositId,
      productId,
      quantity,
      price,
      type,
      typeDescription,
      document,
    } = params;

    return this.prisma.productMovement.create({
      data: {
        deposit: { connect: { id: depositId } },
        product: { connect: { id: productId } },
        quantity,
        price,
        type,
        typeDescription,
        document,
      },
    });
  }

  async removeProductFromDeposit(params: {
    depositId: number;
    productId: number;
  }): Promise<Deposit> {
    const { depositId, productId } = params;

    return this.prisma.deposit.update({
      where: { id: depositId },
      data: {
        products: {
          delete: { id: productId },
        },
      },
    });
  }
}
