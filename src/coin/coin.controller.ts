import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoinService } from './coin.service';
import { Coin } from './schemas/coin.schema';

@Controller('coin')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Post()
  create(@Body() coin: Coin) {
    return this.coinService.create(coin);
  }

  @Get()
  findAll() {
    return this.coinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() coin: Coin) {
    return this.coinService.update(id, coin);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coinService.remove(id);
  }

  @Post('updateCoinList')
  updateCoin() {
    return this.coinService.updateCoin();
  }
  @Post('updateCoinChart')
  updateCoinChart() {
    return this.coinService.updateCoinChart();
  }
  @Post('updateCoinChartBySlug/:slug')
  updateCoinChartBySlug(@Param('slug') slug: string) {
    return this.coinService.updateCoinChartBySlug(slug);
  }
  @Post('autoUpdate')
  autoUpdate() {
    return this.coinService.autoUpdate();
  }
}
