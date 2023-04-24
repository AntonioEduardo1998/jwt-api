import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
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
}
