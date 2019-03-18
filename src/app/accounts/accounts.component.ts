import { Component } from '@angular/core';

import { MENU_ITEMS } from './accountes-menu';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';

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

  constructor(public api: ApiService, public accountService: AccountService) {
    this.getBranches();
  }

  getBranches() {
    this.api.post('Suggestion/GetBranchList', { search: 123 })
      .subscribe(res => {
        console.log('Branches :', res['data']);
        this.accountService.branches = res['data'];
      }, err => {
        console.log('Error: ', err);
      });
  }
}
