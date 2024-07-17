import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';
import { IUserRequest } from 'utils/types/user';
import { Offer } from './entities/offer.entity';
import { JwtGuard } from 'src/auth/guards/jwtGuard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Body() dto: CreateOfferDto,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    return this.offersService.create(dto, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
