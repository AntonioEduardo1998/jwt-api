import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from 'src/services/product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get('products')
  async findAllProducts() {
    const products = await this.productService.products();
    return products;
  }

  @UseGuards(JwtAuthGuard)
  @Post('product')
  async createProduct(@Body() productData: Prisma.ProductCreateInput) {
    const product = await this.productService.createProduct(productData);
    return product;
  }
}
