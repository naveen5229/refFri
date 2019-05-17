import { Component } from '@angular/core';

import { MENU_ITEMS } from './accountes-menu';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';
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
export class AccountsComponent {

  menu = MENU_ITEMS;

  constructor(public api: ApiService,
    public router: Router,
    public user: UserService, public accountService: AccountService) {
    if (this.user._loggedInBy == 'customer') {
      this.router.navigate(['/pages']);
      return;
    }
    if (!this.accountService.branches.length) {
      this.getBranches();
      this.getFinancial();
    }
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

  getFinancial() {
    this.api.post('Suggestion/GetFinancialYear', { search: 123 })
      .subscribe(res => {
        console.log('financial :', res['data']);
        this.accountService.financialYears = res['data'];
        this.accountService.financialYears.map(financialYear => {
          if (financialYear.name.split('-')[0] == (new Date()).getFullYear()) {
            this.accountService.selected.financialYear = financialYear;
          }
        });
      }, err => {
        console.log('Error: ', err);
      });
  }
}
