import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Deposit, User as UserModel } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UserService } from './user.service';
import { DepositService } from './deposit.service';
import { ProductService } from './product.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly depositService: DepositService,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: UserModel,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(): Promise<UserModel[]> {
    return this.userService.users({});
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async createDeposit(@Body() depositData: { name: string }): Promise<Deposit> {
    return this.depositService.createDeposit(depositData);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':depositId/products')
  async createProduct(
    @Param('depositId') depositId: string,
    @Body() productData: { name: string; price: number },
  ) {
    const deposit = await this.depositService.deposit({
      id: Number(depositId),
    });
    if (!deposit) {
      return { message: 'Deposit not found' };
    }

    const produto = await this.productService.createProduct({
      ...productData,
      deposit: { connect: { id: deposit.id } },
    });

    return produto;
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
}
