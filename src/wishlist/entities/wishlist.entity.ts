import { IsString, IsUrl, Length, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { BaseEntity } from 'utils/entity/base.entity';
import { TUser } from 'utils/types/user';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    default: 'Пока нет описания',
  })
  @IsString()
  @Length(1, 1024)
  description: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { nullable: false })
  owner: TUser;
}
