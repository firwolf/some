import { Pipe } from '@angular/core';
import { TranslatePipe as NgxTranslatePipe } from '@ngx-translate/core';

@Pipe({ name: 't' })
export class TranslatePipe extends NgxTranslatePipe { }
