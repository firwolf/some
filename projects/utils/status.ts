import { last } from 'ramda';

import { deployUrl } from 'shared/const';

import { statuses, Status } from './status.const';

export const isTopStatus = (status: string) => last(statuses) === status;

export const getStatusIconPath = (status: string, big = false) =>
  `icons/status-${getStatus(status)}${big ? '-big' : ''}.svg`;

export const getStatusIconFullPath = (status: string) =>
  `${deployUrl}assets/${getStatusIconPath(status)}`;

export const getStatus = status => status === Status.Free ? 'demo' : status;
