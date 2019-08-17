export interface VUIInputCounterEvent {
  value: string;
  direction?: 'up' | 'down';
  step?: string;
  index?: number;
}
