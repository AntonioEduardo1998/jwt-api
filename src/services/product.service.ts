import { Injectable } from '@nestjs/common';
import { Prisma, Product, ProductMovement } from '@prisma/client';
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
}
