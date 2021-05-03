import { Component } from '@angular/core';

import { ADMIN_MENU_ITEMS, CUSTOMER_MENU_ITEMS } from './documents-menu';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class DocumentsComponent {
  menu = this.user._loggedInBy == 'admin' ? ADMIN_MENU_ITEMS : CUSTOMER_MENU_ITEMS;
  constructor(public user: UserService, public router: Router) {
    // if (this.user._loggedInBy == 'customer') {
    //   this.router.navigate(['/pages']);
    //   return;
    // }

  }
  ngOnDestroy(){}

}
