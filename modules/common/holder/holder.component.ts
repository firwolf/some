import {
  Component, Input, Output,
  EventEmitter, ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-holder',
  templateUrl: './holder.tpl.pug',
  styleUrls: ['./holder.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolderComponent {
  @Input() imgPath: string;
  @Input() title: string;
  @Input() text: string;
  @Input() btnLabel: string;
  @Input() isModal = false;
  @Input() stretchHeight = false;

  @Output() btnClick = new EventEmitter<void>();
}
