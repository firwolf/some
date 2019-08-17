import { Type } from '@angular/core';

import { MenuItem } from './menu-item';
import { Breadcrumbs } from './breadcrumbs';

export interface DashboardItem {
  menu: MenuItem;
  title: Breadcrumbs;
  content: Type<any>;
  infinityScroll?: (...args) => any;
}
