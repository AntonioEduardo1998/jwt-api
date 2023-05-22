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
    });
  }

  async deposits(): Promise<Deposit[]> {
    return this.prisma.deposit.findMany();
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
  }): Promise<any> {
    const { depositId, productId } = params;

    return this.prisma.productMovement.deleteMany({
      where: {
        depositId,
        productId,
      },
    });
  }

  async calculateStock(productId: number): Promise<{ stock: number }> {
    const inputMovements = await this.prisma.productMovement.findMany({
      where: {
        productId,
        type: 'input',
      },
    });

    const outputMovements = await this.prisma.productMovement.findMany({
      where: {
        productId,
        type: 'output',
      },
    });

    const totalInputQuantity = inputMovements.reduce(
      (total, movement) => total + movement.quantity,
      0,
    );

    const totalOutputQuantity = outputMovements.reduce(
      (total, movement) => total + movement.quantity,
      0,
    );

    const stock = totalInputQuantity - totalOutputQuantity;

    return { stock };
  }
}
