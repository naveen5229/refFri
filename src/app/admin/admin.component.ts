import { Component } from '@angular/core';
import { RouteGuard } from '../guards/route.guard';

import { MENU_ITEMS } from './admin-menu';
import { from } from 'rxjs';
import { routes } from '@nebular/auth';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['./admin.scss'],
  template: `
    <ngx-sample-layout class="admin">
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet class="admin-dot"></router-outlet>
    </ngx-sample-layout>
  `,
})
export class AdminComponent {
  menu = this.common.menuGenerator('admin');
  constructor(public common: CommonService, public user: UserService, public router: Router) {
    if (this.user._loggedInBy == 'customer') {
      this.router.navigate(['/pages']);
      return;
    }
  }
}
