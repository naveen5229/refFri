import { Component } from '@angular/core';

import { ADMIN_MENU_ITEMS, CUSTOMER_MENU_ITEMS } from './lorry-receipt-menu';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'ngx-lorry-receipt',
  template: `

    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class LorryReceiptComponent {
  menu = this.user._loggedInBy == 'admin' ? ADMIN_MENU_ITEMS : CUSTOMER_MENU_ITEMS;
  constructor(public user: UserService, public api: ApiService, public router: Router) {
    if (this.user._loggedInBy == 'customer') {
      this.api.getBranches();
      this.router.navigate(['/pages']);
      return;
    }
  }

}
