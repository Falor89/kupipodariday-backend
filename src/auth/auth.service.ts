import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findUserPassword(username);

    if (!user) {
      throw new UnauthorizedException(
        'Ошибка, имя пользователя или пароль не совпадает!',
      );
    }

    const checkHash = this.hashService.compare(password, user.password);

    if (!checkHash) {
      throw new UnauthorizedException(
        'Ошибка, имя пользователя или пароль не совпадает!',
      );
    }

    return user;
  }
}
