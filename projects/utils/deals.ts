import { prop, propEq, uniqBy } from 'ramda';

import { OptionDeal } from '../trading/app/trades/option/interface';

export const getType = account => account.tournamentId > 0 ? 'tournament' : account.type;

export const getTournamentId = id => id > 0 ? id : '';

export const ricEq = propEq('ric');

export const amount = prop('amount');

export const uniqById = uniqBy(prop('id'));

export const isFinished = (date: number, deal: OptionDeal) =>
  new Date(date).getTime() - new Date(deal.close_quote_created_at).getTime() > 0;

const isWinning = (rate: number, deal: OptionDeal) => deal.trend === 'call'
  ? rate >= deal.open_rate
  : rate <= deal.open_rate;

export const profit = (rate: number, deal: OptionDeal) => isWinning(rate, deal)
  ? (deal.open_rate === rate && deal.amount) || deal.payment
  : 0;

