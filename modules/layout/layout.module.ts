import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from 'modules/common';

import { ModalController, ModalService } from './modal';
import { HeaderComponent } from './header/header.component';
import { PanelComponent } from './panel/panel.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { DashboardComponent, BreadcrumbsComponent } from './dashboard';
import { SpotDirective, Sherlock } from './sherlock';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    HeaderComponent,
    SubHeaderComponent,
    DashboardComponent,
    BreadcrumbsComponent,
    PanelComponent,
    PlaceholderComponent,
    SpotDirective,
  ],
  declarations: [
    HeaderComponent,
    SubHeaderComponent,
    DashboardComponent,
    BreadcrumbsComponent,
    PanelComponent,
    PlaceholderComponent,
    ModalController,
    SpotDirective,
  ],
  entryComponents: [
    ModalController,
  ],
  providers: [
    ModalService,
    Sherlock,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule {}
