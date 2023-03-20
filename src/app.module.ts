import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { LocalStrategy } from './auth/local.strategy';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
  ],
})
export class AppModule {}
