import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/respons.utils';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { ResponSucces } from 'src/Interface';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private jwtService : JwtService,
  ) {
    super();
  }
  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<ResponSucces> {
    // cek email sduah ada atau belom
    const checkUserExist = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExist) {
        throw new HttpException(
            'Email sudah digunakan',
            HttpStatus.FOUND,
        )
    }

    //hash password
    payload.password = await hash(payload.password, 12);
    await this.authRepository.save(payload);
    return this._succes('Register Berhasil');
  }

  async login(payload: LoginDto): Promise<ResponSucces> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    ); // compare password yang dikirim dengan password yang ada di tabel
    if (checkPassword) {

      const jwtPayload : jwtPayload={
        id : checkUserExists.id,
        nama : checkUserExists.nama,
        email : checkUserExists.email
      }
      const accses_token = await this.generateJWT(
        jwtPayload,
        "1d",
        process.env.ACCSES_TOKEN_SECRET
      )

      return this._succes('Login Success', {
        ...checkUserExists,
        accses_token
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }



}
