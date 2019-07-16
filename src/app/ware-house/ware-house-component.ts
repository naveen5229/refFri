import { Component } from '@angular/core';
import { ADMIN_MENU_ITEMS } from './ware-house-menu';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class WareHouseComponent {
  menu = ADMIN_MENU_ITEMS;
  constructor(public user: UserService, public router: Router) {
    // if (this.user._loggedInBy == 'customer') {
    //     this.router.navigate(['/pages']);
    //     return;
    // }

  }
}
