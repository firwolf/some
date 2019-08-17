import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HolderComponent } from './holder/holder.component';
import { FORM_COMPONENTS } from './forms';

import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,

    HolderComponent,

    ...FORM_COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  declarations: [
    HolderComponent,

    ...FORM_COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommonModule {}
