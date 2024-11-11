import { Schema, Prop } from '@nestjs/mongoose';

// const fields = [
//   // 'active_addresses_daily',
//   // 'active_addresses_monthly',
//   // 'active_addresses_weekly',
//   // 'active_developers',
//   // 'active_loans',
//   'afpu',
//   'arpu',
//   // 'code_commits',
//   // 'earnings',
//   // 'expenses',
//   'fees',
//   'fees_supply_side',
//   // 'gas_used',
//   'market_cap_circulating',
//   'market_cap_fully_diluted',
//   // 'net_deposits',
//   'pf_circulating',
//   'pf_fully_diluted',
//   'price',
//   'ps_circulating',
//   'ps_fully_diluted',
//   'revenue',
//   // 'token_incentives',
//   // 'token_supply_circulating',
//   // 'token_supply_maximum',
//   'token_trading_volume',
//   'token_turnover_circulating',
//   'token_turnover_fully_diluted',
//   // 'tokenholders',
//   // 'transaction_count_contracts',
//   // 'treasury',
//   // 'treasury_net',
//   // 'tvl',
//   // 'user_dau',
//   // 'user_mau',
//   // 'user_wau',
// ];
@Schema()
export class ChartSerie {
  @Prop({ required: true, index: true })
  timestamp: string;
  @Prop(Number)
  afpu: number;
  @Prop(Number)
  arpu: number;
  @Prop(Number)
  fees: number;
  @Prop(Number)
  fees_supply_side: number;
  @Prop(Number)
  market_cap_circulating: number;
  @Prop(Number)
  market_cap_fully_diluted: number;
  @Prop(Number)
  pf_circulating: number;
  @Prop(Number)
  pf_fully_diluted: number;
  @Prop(Number)
  price: number;
  @Prop(Number)
  ps_circulating: number;
  @Prop(Number)
  ps_fully_diluted: number;
  @Prop(Number)
  revenue: number;
  @Prop(Number)
  token_trading_volume: number;
  @Prop(Number)
  token_turnover_circulating: number;
  @Prop(Number)
  token_turnover_fully_diluted: number;
}
