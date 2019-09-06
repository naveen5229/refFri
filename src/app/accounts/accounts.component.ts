import { Component } from '@angular/core';

import { ACCOUNTS_MENU_ITEMS } from './accountes-menu';
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
  host: {
    '(document:keydown)': 'onKeyDown($event)'
  }
})
export class AccountsComponent {
  menu = ACCOUNTS_MENU_ITEMS;


  constructor(public api: ApiService,
    public router: Router,
    public user: UserService, public accountService: AccountService) {
    // if (this.user._loggedInBy == 'customer') {
    //   this.router.navigate(['/pages']);
    //   return;
    // }
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
        this.accountService.selected.branch.id = 0;
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
        this.getFinancial();
        console.log('Error: ', err);
      });
  }

  onKeyDown(event) {
    console.log('================== Key Down Event ==========:', event);
    const keys = ['f4', 'f5', 'f6', 'f7', 'f8', 'f9'];
    const key = event.key.toLowerCase();
    const index = keys.indexOf(key);
    if (index != -1) {
      const routes = {
        'f4': '/accounts/vouchers/-8/Contra Voucher',
        'f5': '/accounts/vouchers/-1/Bank Payment Voucher',
        'f6': '/accounts/vouchers/-3/Cash Payment Voucher',
        'f7': '/accounts/vouchers/-2/Bank Receipt Voucher',
        'f8': '/accounts/vouchers/-4/Cash Receipt Voucher',
        'f9': '/accounts/vouchers/-7/Journal Voucher'
      }
      let pressedKey = keys[index];
      console.log('Pressed Key:', pressedKey);
      this.router.navigate([routes[pressedKey]]);
      event.preventDefault();
    }
  }
}
