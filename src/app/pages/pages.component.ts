import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { NbMenuService } from '@nebular/theme';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['./pages.component.css'],
  template: `
    <ngx-sample-layout>
    
       <nb-menu [items]="menu" autoCollapse="true"></nb-menu>
     
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;

  constructor(public menuService: NbMenuService,
    public api: ApiService,
    public accountService: AccountService
  ) {
    console.log('Menu:', this.menuService);
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
