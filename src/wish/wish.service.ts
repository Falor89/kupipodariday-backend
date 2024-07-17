import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/updateWish.dto';
import { TUser } from 'utils/types/user';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, user: User): Promise<Record<string, never>> {
    this.wishRepository.save({
      ...dto,
      owner: user,
    });
    return {};
  }

  async findOne(id: number): Promise<Wish> {
    const wish = this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    return wish;
  }

  async findAll(): Promise<Wish[]> {
    return this.wishRepository.find();
  }

  async updateOne(
    id: number,
    dto: UpdateWishDto,
    user: TUser,
  ): Promise<Record<string, never>> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new HttpException(
        'Подарок принадлежит другому пользователю',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishRepository.update(id, dto);
    return {};
  }

  async removeOne(id: number, user: TUser): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new HttpException(
        'Нельзя удалить подарок, который принадлежит другому пользователю',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishRepository.delete(id);

    return wish;
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: { createAt: 'DESC' },
      take: 40,
    });
  }
  async copyById(wishId: number, user: User): Promise<Record<string, never>> {
    const wishToCopy = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (user.id === wishToCopy.owner.id) {
      throw new HttpException(
        'Нельзя копировать свой подарок',
        HttpStatus.FORBIDDEN,
      );
    }

    const createWishDto: CreateWishDto = {
      name: wishToCopy.name,
      link: wishToCopy.link,
      image: wishToCopy.image,
      price: wishToCopy.price,
      description: wishToCopy.description,
    };

    await this.create(createWishDto, user);
    await this.wishRepository.increment({ id: wishId }, 'copied', 1);
    return {};
  }

  async raisedUpdate(id: number, countRaised: number): Promise<Wish> {
    await this.wishRepository.update(id, { raised: countRaised });

    return this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }
}
