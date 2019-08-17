import { NgModule } from '@angular/core';

import { system } from '@vision/rx';

import { HotkeysModel } from 'shared/hotkeys/hotkeys.model';

@NgModule({
  providers: [HotkeysModel],
})
export class HotkeysModule {
  constructor(model: HotkeysModel) {
    system.register(model);
  }
}
