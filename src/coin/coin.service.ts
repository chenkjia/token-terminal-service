import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { pick, map } from 'lodash';
import { pick, map, keys, intersection } from 'lodash';

import { Coin } from './schemas/coin.schema';
import httpService from '../httpService';

const delayL = (x) =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 300 * x + 300 * x);
  });
const fields = [
  'afpu',
  'arpu',
  'fees',
  'fees_supply_side',
  'market_cap_circulating',
  'market_cap_fully_diluted',
  'pf_circulating',
  'pf_fully_diluted',
  'price',
  'ps_circulating',
  'ps_fully_diluted',
  'revenue',
  'token_trading_volume',
  'token_turnover_circulating',
  'token_turnover_fully_diluted',
];
@Injectable()
export class CoinService {
  constructor(@InjectModel(Coin.name) private coinModel: Model<Coin>) {}

  async create(coin: Coin): Promise<Coin> {
    const createdCoin = new this.coinModel(coin);
    return createdCoin.save();
  }

  async findAll(): Promise<Coin[]> {
    return this.coinModel.find().exec();
  }

  async findOne(id: string): Promise<Coin> {
    return this.coinModel.findById(id).exec();
  }
  async findOneBy(coin): Promise<Coin> {
    return this.coinModel.findOne(coin).exec();
  }

  async update(id: string, coin: Coin): Promise<Coin> {
    return this.coinModel.findByIdAndUpdate(id, coin, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.coinModel.findByIdAndDelete(id).exec();
  }
  async autoUpdate(): Promise<void> {
    await this.updateCoin();
    await this.updateCoinChart();
  }

  // 更新coin列表
  async updateCoin(): Promise<void> {
    const { data } = await httpService.get('projects');
    // for (let index = 0; index < 3; index++) {
    for (let index = 0; index < data.data.length; index++) {
      const element = data.data[index];
      await this.updateCoinBase(element);
    }
    return data.data.length;
  }
  // 更新单个Coin的基础信息
  async updateCoinBase(coin): Promise<void> {
    const DBdata = await this.findOneBy(pick(coin, ['slug']));
    // 获取每个代币的数据类型列表
    coin.metric_list = await this.getMetric(coin.slug);
    // 查询数据库是否存在该Coin
    // 如果存在,则更新应该Coin信息，如果不存在，则新增该Coin信息
    const info = DBdata
      ? await this.update(DBdata._id, coin)
      : await this.create(coin);
    console.log(info);
  }
  async getMetric(slug): Promise<void> {
    await delayL(5);
    try {
      const { data } = await httpService.get(
        `projects/${slug}/metric-availability`,
      );
      return map(data.data, 'id');
    } catch {
      return await this.getMetric(slug);
    }
  }

  // 更新每一个coin的chart数据
  async updateCoinChart(): Promise<void> {
    const coinList = await this.findAll();
    const now = new Date();
    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000 - 2 * 24 * 60 * 60 * 1000,
    );
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`;
    console.log(formattedDate);
    const waitToUpdateList = coinList.filter((coin) => {
      const metric_list = intersection(coin.metric_list, fields);
      return (
        metric_list.length &&
        !(
          coin.chart_series[0] &&
          coin.chart_series[0].timestamp === formattedDate
        )
      );
    });
    console.log(waitToUpdateList.length);
    for (let index = 0; index < waitToUpdateList.length; index++) {
      const coin = waitToUpdateList[index];
      await this.updateCoinChartBySlug(coin.slug);
    }
  }

  // 更新单个coin的chart数据
  async updateCoinChartBySlug(slug): Promise<void> {
    console.log(`----------------${slug}-----------------`);
    const DBdata = await this.findOneBy({ slug });
    const metric_list = intersection(DBdata.metric_list, fields);
    let chartDate = {};
    for (let index = 0; index < metric_list.length; index++) {
      const metric = metric_list[index];
      const tmp = await this.getChart(slug, metric);
      chartDate = this.chartFormat(chartDate, tmp, metric);
      console.log(metric);
    }
    const chart_series = map(keys(chartDate), (key) => ({
      timestamp: key,
      ...chartDate[key],
    }));
    chart_series.reverse().forEach((element) => {
      if (!DBdata.chart_series.find((c) => c.timestamp === element.timestamp)) {
        DBdata.chart_series.unshift(element);
      }
    });
    await DBdata.save();
    // const chart = map(DBdata.metric_list, (metric) => {
    //   const item = charts[key][0];
    //   return {
    //     timestamp: item.timestamp,
    //     [metric]: item.value,
    //   };
    // });
    // console.log(chart);
  }
  chartFormat = (chartDate, chart, metric) => {
    return chart.reduce((result, item) => {
      result[item.timestamp] = {
        ...result[item.timestamp],
        [metric]: item.value,
      };
      return result;
    }, chartDate);
  };
  async getChart(slug, metric): Promise<void> {
    await delayL(5);
    try {
      const { data } = await httpService.get(
        `/charts/metrics/${metric.replace(/_/g, '-')}?project_slugs=${slug}&interval=365d`,
      );
      return data.data;
    } catch {
      console.log('try---');
      return await this.getChart(slug, metric);
    }
  }

  // 计算出需要对比的数据
}
