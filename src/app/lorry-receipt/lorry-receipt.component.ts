import { Component } from '@angular/core';

import { ADMIN_MENU_ITEMS, CUSTOMER_MENU_ITEMS } from './lorry-receipt-menu';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  constructor(public user: UserService, public api: ApiService, public router: Router, public accountService: AccountService) {
    if (!this.accountService.branches.length) {
      this.getBranches();
      this.getFinancial();
      this.router.navigate(['/pages']);
      return;
    }
  }
  ngOnDestroy() { }


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
