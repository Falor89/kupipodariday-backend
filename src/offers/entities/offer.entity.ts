import { IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'utils/entity/base.entity';
import { TUser } from 'utils/types/user';

@Entity()
export class Offer extends BaseEntity {
  @Column({
    type: 'decimal',
    scale: 2,
  })
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: TUser;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
