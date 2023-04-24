import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LocalStrategy } from './auth/local.strategy';
import { ProductController } from './controllers/product.controller';
import { UserController } from './controllers/user.controller';
import { DepositService } from './services/deposit.service';
import { PrismaService } from './services/prisma.service';
import { ProductService } from './services/product.service';
import { UserService } from './services/user.service';
import { DepositController } from './controllers/deposit.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController, ProductController, DepositController],
  providers: [
    UserService,
    DepositService,
    ProductService,
    PrismaService,
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
  ],
})
export class AppModule {}
