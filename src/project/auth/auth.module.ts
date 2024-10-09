import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProjectService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './jwtAccessToken.startegy';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),JwtModule.register({})
  ],
  controllers: [AuthController ],
  providers: [ProjectService,JwtAccessTokenStrategy]
})
export class projectModule {}
