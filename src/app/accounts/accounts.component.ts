import { Component } from '@angular/core';

import { MENU_ITEMS } from './accountes-menu';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class AccountsComponent {

  menu = MENU_ITEMS;
}
