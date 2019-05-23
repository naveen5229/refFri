import { Component } from '@angular/core';

import { MENU_ITEMS } from './walle8-menu';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class Walle8Component {

  menu = MENU_ITEMS;
  constructor(public user: UserService, public router: Router) {
    // if (this.user._loggedInBy == 'customer') {
    //   this.router.navigate(['/pages']);
    //   return;
    // }
  }
}