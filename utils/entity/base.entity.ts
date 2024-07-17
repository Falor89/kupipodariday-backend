import { IsDate, IsInt } from "class-validator";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn()
    @IsInt()
    id: number;

    @CreateDateColumn()
    @IsDate()
    createAt: Date;

    @CreateDateColumn()
    @IsDate()
    updateAt: Date;
}