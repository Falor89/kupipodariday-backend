import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishService } from './wish.service';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { CreateWishDto } from './dto/createWish.dto';
import { IUserRequest } from 'utils/types/user';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/updateWish.dto';

@Controller('wishes')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return this.wishService.findTop();
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return this.wishService.findLast();
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() dto: CreateWishDto,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    await this.wishService.create(dto, req.user);
    return {};
  }

  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishService.findOne(id);
  }

  @Get()
  async getAll(): Promise<Wish[]> {
    return this.wishService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateWish(
    @Param('id') id: number,
    @Body() dto: UpdateWishDto,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    return this.wishService.updateOne(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteWish(
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ): Promise<Wish> {
    return this.wishService.removeOne(id, req.user);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  async copyWish(
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    return this.wishService.copyById(id, req.user);
  }
}
