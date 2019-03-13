import { Component } from '@angular/core';
import { RouteGuard } from '../guards/route.guard';

import { MENU_ITEMS } from './admin-menu';
import { from } from 'rxjs';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class AdminComponent {
  menu = MENU_ITEMS;
  // page = ;
  
}
