import { Request } from "express";
import { User } from "src/users/entities/user.entity";

export type TUser = Omit<User, 'password' | 'hashPassword'>;

export interface IUserRequest extends Request {
    user: User,
}