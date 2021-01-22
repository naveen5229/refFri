import { Component } from '@angular/core';

import { MENU_ITEMS } from './imtelligence-menu';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class IntelligenceComponent {

  menu = MENU_ITEMS;
  ngOnDestroy(){}
}
