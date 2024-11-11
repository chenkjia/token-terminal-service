import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { Types, Document } from 'mongoose';

import { ChartSerie } from './chartSerie.schema';

@Schema()
export class Coin extends Document {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop({ required: true, index: true, unique: true })
  slug: string;

  @Prop()
  api_id: string;

  @Prop([String])
  market_sectors: string[];

  @Prop([String])
  metric_list: string[];

  @Prop([ChartSerie])
  chart_series: ChartSerie[];
}
const CoinSchema = SchemaFactory.createForClass(Coin);

export { CoinSchema };
