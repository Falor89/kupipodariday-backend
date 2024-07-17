import { BaseEntity } from 'utils/entity/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Wish } from 'src/wish/entities/wish.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @IsOptional()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Пароль должен содержать не менее 2 символов',
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
