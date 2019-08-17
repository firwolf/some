import { Dispatcher } from '@vision/rx';

export class AppDispatcher extends Dispatcher { }

export const appDispatcher = new AppDispatcher();

export function getAppDispatcher() {
  return appDispatcher;
}

export const provider = {
  provide: AppDispatcher,
  useFactory: getAppDispatcher,
};
