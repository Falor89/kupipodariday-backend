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
import { WishlistService } from './wishlist.service';
import { Wishlist } from './entities/wishlist.entity';
import { IUserRequest } from 'utils/types/user';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistService.findOne(id);
  }

  @Get()
  async findAll(@Req() req: IUserRequest): Promise<Wishlist[]> {
    return this.wishlistService.findAll(req.user.id);
  }

  @Post()
  async createWishlist(
    @Body() dto: CreateWishlistDto,
    @Req() req: IUserRequest,
  ): Promise<Wishlist> {
    return this.wishlistService.create(dto, req.user);
  }

  @Patch(':id')
  async updateWishlist(
    @Param('id') id: number,
    @Body() dto: UpdateWishlistDto,
    @Req() req: IUserRequest,
  ): Promise<Wishlist> {
    return this.wishlistService.update(id, dto, req.user);
  }

  @Delete(':id')
  async deleteWishlist(
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ): Promise<Wishlist> {
    return this.wishlistService.deleteOne(id, req.user);
  }
}
