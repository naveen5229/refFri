import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ApiService } from '../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-pages',
  styleUrls: ['./admin.scss'],
  template: `
    <ngx-sample-layout class="admin">
      <nb-menu *ngIf="user._menu.admin.length" [items]="user._menu.admin" autoCollapse="true"></nb-menu>
      <router-outlet class="admin-dot"></router-outlet>
    </ngx-sample-layout>
  `,
})
export class AdminComponent {
  constructor(public common: CommonService,
    public user: UserService,
    public api: ApiService,
    public router: Router,
    public accountService: AccountService) {
      console.log(user._menu.admin);

    if (this.user._loggedInBy == 'customer') {
      this.router.navigate(['/pages']);
      return;
    }
    if (!this.accountService.branches.length) {
      this.getBranches();
    }
  }

  ngOnDestroy(){}


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
