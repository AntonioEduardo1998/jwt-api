import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Deposit, Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepositService } from '../services/deposit.service';

@Controller()
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async createDeposit(
    @Body() depositData: Prisma.DepositCreateInput,
  ): Promise<Deposit> {
    return this.depositService.createDeposit(depositData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('deposits')
  async findAllDeposits() {
    const deposits = await this.depositService.deposits();
    return deposits;
  }

  @UseGuards(JwtAuthGuard)
  @Get('deposit/:depositId')
  async findDepositById(@Param('depositId') depositId: number) {
    const deposit = await this.depositService.findDepositById(
      Number(depositId),
    );

    if (!deposit) {
      return { message: 'Deposit not found' };
    }

    return deposit;
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit/:depositId/product/:productId')
  async insertProductInDeposit(
    @Param('depositId') depositId: number,
    @Param('productId') productId: number,
    @Body()
    depositData: {
      quantity: number;
      price: number;
      type: 'input' | 'output';
      typeDescription: string;
      document: string;
    },
  ) {
    const deposit = await this.depositService.insertProductInDeposit({
      depositId: Number(depositId),
      productId: Number(productId),
      ...depositData,
    });

    if (!deposit) {
      return { message: 'Deposit not found' };
    }

    return deposit;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deposit/:depositId/product/:productId')
  async removeProdutFromDeposit(
    @Param('depositId') depositId: number,
    @Param('productId') productId: number,
  ) {
    const deposit = await this.depositService.removeProductFromDeposit({
      depositId: Number(depositId),
      productId: Number(productId),
    });

    if (!deposit) {
      return { message: 'Deposit not found' };
    }

    return deposit;
  }
}
