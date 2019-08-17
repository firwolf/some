import { Component, OnInit } from '@angular/core';

import { fire } from '@vision/rx';

import { HeaderComponent } from '../header/header.component';
import { subHeaderInited } from '../const';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.tpl.pug',
  styleUrls: ['./sub-header.style.scss'],
})

export class SubHeaderComponent extends HeaderComponent implements OnInit {
  ngOnInit(): void {
    fire(subHeaderInited, this);
  }
}
