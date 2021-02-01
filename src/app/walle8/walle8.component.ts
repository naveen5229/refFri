import { Component } from '@angular/core';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
    <nb-menu [items]="user._menu.walle8" autoCollapse="true"></nb-menu>
    <router-outlet></router-outlet>
  </ngx-sample-layout>
  `,
  styleUrls: ['./walle8.component.scss']

})
export class Walle8Component {

  constructor(public user: UserService, public router: Router) {
    // if (this.user._loggedInBy == 'customer') {
    //   this.router.navigate(['/pages']);
    //   return;
    // }
  }
  ngOnDestroy() { }

}
