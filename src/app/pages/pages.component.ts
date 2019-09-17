import { Component } from '@angular/core';
import { PAGES_MENU_ITEMS } from './pages-menu';
import { NbMenuService } from '@nebular/theme';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['./pages.component.css'],
  template: `
    <ngx-sample-layout>
    
       <nb-menu [items]="user._menu.pages" autoCollapse=true></nb-menu>
     
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {

  // menu = MENU_ITEMS;

  constructor(public menuService: NbMenuService,
    public api: ApiService,
    public accountService: AccountService,
    public user: UserService,
    public router: Router,

  ) {
    if (!this.accountService.branches.length) {
      this.getBranches();
      this.getFinancial();
    }
    if (this.user._loggedInBy == 'admin' && !this.user._customer.id) {
      alert("Select Fo Admin First");
      this.router.navigate(['/admin']);
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
