import {
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { TUser } from 'utils/types/user';
import { BaseEntity } from 'utils/entity/base.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Название подарка должно содержать не менее 1 символа',
  })
  @MaxLength(250, {
    message: 'Название подарка должно содержать не более 250 символов',
  })
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @Min(1)
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  @Min(1)
  raised: number;

  @Column()
  @IsString()
  @MinLength(1, {
    message: 'Описание подарка должно содержать не менее 1 символа',
  })
  @MaxLength(1024, {
    message: 'Описание подарка должно содержать не более 1024 символов',
  })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 })
  @IsNumber()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: TUser;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}
