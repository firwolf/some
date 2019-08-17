import { compose, values, test, filter } from 'ramda';

export const getFailureEvents: any = compose(filter(test(/Failure$/)), values);
