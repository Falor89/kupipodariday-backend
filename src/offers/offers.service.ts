import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from 'src/wish/entities/wish.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { TUser } from 'utils/types/user';
import { WishService } from 'src/wish/wish.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly wishesServise: WishService,
  ) {}

  async findOne(id: number): Promise<Offer> {
    const offer = this.offerRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        item: true,
      },
    });
    if (!offer) {
      throw new NotFoundException();
    }

    return offer;
  }

  async create(
    dto: CreateOfferDto,
    user: TUser,
  ): Promise<Record<string, never>> {
    const wish = await this.wishesServise.findOne(dto.itemId);

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException();
    }

    const countRaised = Number(wish.raised) + Number(dto.amount);

    if (countRaised > wish.price) {
      throw new BadRequestException();
    }

    const wishUpdate = await this.wishesServise.raisedUpdate(
      wish.id,
      countRaised,
    );

    this.offerRepository.save({
      user: user,
      item: wishUpdate,
      ...dto,
    });
    return {};
  }
}
