import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.tpl.pug',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  @Input() items: string[];

  @Output() select = new EventEmitter();

  back(index: number) {
    this.select.emit({
      index,
      title: this.items[index],
      back: index - (this.items.length - 1),
    });
  }
}
