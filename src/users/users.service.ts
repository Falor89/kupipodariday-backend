import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Wish } from 'src/wish/entities/wish.entity';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email: email });
  }

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOneBy({ username: name });
  }

  async findUserPassword(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect(['user.password'])
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findMany(str: string): Promise<User[]> {
    return this.userRepository.findBy([
      {
        username: Like(`%${str}%`),
      },
      {
        email: Like(`%${str}%`),
      },
    ]);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEmail = await this.findByEmail(createUserDto.email);

    if (userEmail) {
      throw new BadRequestException('Эта почта уже занята');
    }

    const userName = await this.findByName(createUserDto.username);
    if (userName) {
      throw new BadRequestException('Это имя уже занято');
    }

    return this.userRepository.save({
      ...createUserDto,
      password: await this.hashService.getHash(createUserDto.password),
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const anotherUser = await this.findByName(updateUserDto.username);

      if (updateUserDto?.username === anotherUser?.username) {
        throw new BadRequestException();
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const anotherUser = await this.findByEmail(updateUserDto.email);

      if (updateUserDto?.email === anotherUser?.email) {
        throw new BadRequestException();
      }
    }

    if (updateUserDto.password) {
      updateUserDto = {
        ...updateUserDto,
        password: await this.hashService.getHash(updateUserDto.password),
      };
    }

    const updateData: User = {
      ...user,
      ...updateUserDto,
    };

    await this.userRepository.update(user.id, updateData);

    return this.findById(user.id);
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    return await this.wishRepository.findBy({
      owner: { username: username },
    });
  }

  async findWishesByUserId(userId: number): Promise<Wish[]> {
    return await this.wishRepository.findBy({
      owner: { id: userId },
    });
  }

  // async deleteUser(id: number) {
  //   const user = await this.userRepository.findOneBy({ id: id })
  //   if (!user) {
  //     throw new NotFoundException('Пользователь не найден!')
  //   }

  //   return this.userRepository.delete({ id })
  // }
}
