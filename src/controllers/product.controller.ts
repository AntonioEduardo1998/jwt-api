import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @Get('product/average-prices/:productId')
  async calculateAveragePrices(
    @Param('productId') productId: string,
  ): Promise<{ averagePurchasePrice: number; averageSalePrice: number }> {
    const movements = await this.productService.findProductMovements(
      parseInt(productId, 10),
    );

    const inputMovements = movements.filter(
      (movement) => movement.type === 'input',
    );
    const outputMovements = movements.filter(
      (movement) => movement.type === 'output',
    );

    const averagePurchasePrice =
      inputMovements.reduce((total, movement) => total + movement.price, 0) /
      inputMovements.length;

    const averageSalePrice =
      outputMovements.reduce((total, movement) => total + movement.price, 0) /
      outputMovements.length;

    return {
      averagePurchasePrice: averagePurchasePrice || 0,
      averageSalePrice: averageSalePrice || 0,
    };
  }
}
