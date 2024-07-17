import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Module({
  controllers: [WishController],
  providers: [WishService],
  imports: [TypeOrmModule.forFeature([Wish, Offer])],
  exports: [WishService],
})
export class WishModule {}
