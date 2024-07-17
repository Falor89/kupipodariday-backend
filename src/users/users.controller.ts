import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { TUser, IUserRequest } from 'utils/types/user';
import { JwtGuard } from 'src/auth/guards/jwtGuard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: IUserRequest): Promise<TUser> {
    return this.usersService.findById(req.user.id);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req: IUserRequest): Promise<Wish[]> {
    return this.usersService.findWishesByUserId(req.user.id);
  }

  @Patch('me')
  async updateMe(
    @Body() dto: UpdateUserDto,
    @Req() req: IUserRequest,
  ): Promise<TUser> {
    const user = this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.update(req.user.id, dto);
  }

  @Get(':name')
  async findByName(@Param('name') name: string): Promise<TUser> {
    return this.usersService.findByName(name);
  }

  @Get('')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('find')
  async findMany(@Body() body: { query: string }): Promise<TUser[]> {
    return this.usersService.findMany(body.query);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findUserWishes(username);
  }

  // @Delete(':id')
  // async deleteUser(@Param('id', ParseIntPipe) id: number) {
  //   const user = this.usersService.findById(id)

  //   if (!user) {
  //     throw new NotFoundException
  //   }

  //   return this.usersService.deleteUser(id)
  // }
}
