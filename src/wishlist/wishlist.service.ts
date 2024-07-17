import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { Wish } from 'src/wish/entities/wish.entity';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { TUser } from 'utils/types/user';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async findOne(id: number): Promise<Wishlist> {
    const wishList = await this.wishlistRepository.findOne({
      where: {
        id,
      },
      relations: {
        items: true,
        owner: true,
      },
    });

    if (!wishList) {
      throw new BadRequestException('Список подарков не найден');
    }

    return wishList;
  }

  async findAll(userId: number): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async create(dto: CreateWishlistDto, user: TUser): Promise<Wishlist> {
    const { name, image, itemsId } = dto;

    const wishes = await this.wishRepository.findBy({ id: In(itemsId) });

    return this.wishlistRepository.save({
      name,
      image,
      items: wishes,
      owner: user,
    });
  }

  async update(wishlistId: number, dto: UpdateWishlistDto, user: TUser) {
    const { itemsId, ...wishlist } = dto;
    const wishlistToUpdate = await this.findOne(wishlistId);

    if (!itemsId) {
      const wishes = wishlistToUpdate.items;
      wishlist['items'] = wishes;
    }

    if (wishlistToUpdate.owner.id !== user.id) {
      throw new HttpException(
        'Список подарков принадлежит другому пользователю',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishlistRepository.update(
      {
        id: wishlistId,
        owner: { id: user.id },
      },
      wishlist,
    );

    return this.findOne(wishlistId);
  }

  async deleteOne(wishlistId: number, user: TUser): Promise<Wishlist> {
    const wishlistToDelete = await this.findOne(wishlistId);

    if (wishlistToDelete.owner.id !== user.id) {
      throw new HttpException(
        'Список подарков принадлежит другому пользователю',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishlistRepository.delete(wishlistId);

    return wishlistToDelete;
  }
}
