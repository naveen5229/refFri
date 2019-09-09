import { Component } from '@angular/core';

import { MAINTENANCE_MENU_ITEMS } from './vehicle-maintenance-menu';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="user._menu.vehicleMaintenance" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class VehicleMaintenanceComponent {
  // menu = ADMIN_MENU_ITEMS;
  constructor(public user: UserService, public router: Router) {
    // if (this.user._loggedInBy == 'customer') {
    //     this.router.navigate(['/pages']);
    //     return;
    // }

  }
}
