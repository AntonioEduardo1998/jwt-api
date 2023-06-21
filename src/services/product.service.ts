import { Injectable } from '@nestjs/common';
import { PayableTitle, Prisma, Product, ProductMovement } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async products(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findProductMovements(productId: number): Promise<ProductMovement[]> {
    return this.prisma.productMovement.findMany({
      where: { productId },
    });
  }

  async buyProduct(params: {
    depositId: number;
    productId: number;
    quantity: number;
    price: number;
    typeDescription: string;
    document: string;
  }): Promise<ProductMovement> {
    const { depositId, productId, quantity, price, typeDescription, document } =
      params;

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);

    const payableTitle = await this.prisma.payableTitle.create({
      data: {
        dueDate,
        originalAmount: price,
        situation: 'open',
        openAmount: price,
      },
    });

    await this.prisma.paymentMovement.create({
      data: {
        date: new Date(),
        movementType: 'open',
        payableTitle: { connect: { id: payableTitle.id } },
      },
    });

    return this.prisma.productMovement.create({
      data: {
        deposit: { connect: { id: depositId } },
        product: { connect: { id: productId } },
        quantity,
        price,
        type: 'input',
        typeDescription,
        document,
      },
    });
  }

  async sellProduct(params: {
    depositId: number;
    productId: number;
    quantity: number;
    price: number;
    typeDescription: string;
    document: string;
  }): Promise<ProductMovement> {
    const { depositId, productId, quantity, price, typeDescription, document } =
      params;

    return this.prisma.productMovement.create({
      data: {
        deposit: { connect: { id: depositId } },
        product: { connect: { id: productId } },
        quantity,
        price,
        type: 'output',
        typeDescription,
        document,
      },
    });
  }

  async listPayableTitles(): Promise<PayableTitle[]> {
    return this.prisma.payableTitle.findMany();
  }

  async listPayableTitlesById(id: number): Promise<PayableTitle[]> {
    return this.prisma.payableTitle.findMany({
      where: { id },
    });
  }

  async liquidatePayableTitle(
    id: number,
    value: number,
  ): Promise<{
    message: string;
  } | null> {
    const payableTitle = await this.prisma.payableTitle.findUnique({
      where: { id },
    });

    if (!payableTitle) {
      throw new Error('Payable title not found');
    }

    try {
      if (value > payableTitle.openAmount) {
        throw new Error('Value greater than open amount');
      }

      const openAmount = payableTitle.openAmount - value;

      await this.prisma.paymentMovement.create({
        data: {
          date: new Date(),
          movementType: 'liquidation',
          payableTitle: { connect: { id: payableTitle.id } },
        },
      });

      await this.prisma.payableTitle.update({
        where: { id },
        data: {
          situation: openAmount === 0 ? 'liquidated' : 'open',
          openAmount,
        },
      });

      return {
        message: 'Payable title liquidated',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
