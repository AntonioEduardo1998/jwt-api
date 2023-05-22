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
}
