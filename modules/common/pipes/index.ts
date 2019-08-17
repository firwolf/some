import { CurrencyPipe, CurrencyStreamPipe } from './currency.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { StreamPipe } from './stream.pipe';
import { TranslatePipe } from './translate.pipe';

export const PIPES = [
  CurrencyPipe,
  CurrencyStreamPipe,
  SafeHtmlPipe,
  StreamPipe,
  TranslatePipe,
];

export {
  SafeHtmlPipe,
  StreamPipe,
  TranslatePipe,
};
