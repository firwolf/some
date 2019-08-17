import { isProd } from 'shared/const';

declare global {
  interface Window {
    dataLayer?: any[];
    // TODO: A/B testing
    __minDepositTestRate?: number;
  }
}

export const pushToDataLayer = (event: string) => {
  isProd && window.dataLayer && window.dataLayer.push({ event });
};

export const dataUrlToBlob = (dataUrl: string): Blob =>
  new Blob([
    new Uint8Array(
      atob(dataUrl.split(',')[1]).split('').map(c => c.charCodeAt(0)),
    ),
  ], { type: 'image/png' });

export const randomFromInterval = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);
