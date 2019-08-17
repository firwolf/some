import { Directive, OnInit, ElementRef, Input } from '@angular/core';

import { deployUrl } from 'shared/const';

@Directive({
  selector: '[img]',
})
export class ImgDirective implements OnInit {
  @Input('img') assetPath: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const el = this.el.nativeElement;
    const url = `${deployUrl}assets/${this.assetPath.replace(/^\//, '')}`;

    if (el.tagName === 'IMG')
      el.src = url;
    else
      el.style.backgroundImage = `url('${url}')`;
  }
}
