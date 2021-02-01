import { Component } from '@angular/core';

import { ACCOUNTS_MENU_ITEMS } from './accountes-menu';
import { ApiService } from '../services/api.service';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RangeComponent} from '../acounts-modals/range/range.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
  styleUrls: ['./accounts.scss'],
  host: {
    '(document:keydown)': 'onKeyDown($event)'
  }
})
export class AccountsComponent {
  menu = JSON.parse(ACCOUNTS_MENU_ITEMS);


  constructor(public api: ApiService,
    public router: Router,
    public user: UserService,
     public accountService: AccountService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal,) {
    // if (this.user._loggedInBy == 'customer') {
    //   this.router.navigate(['/pages']);
    //   return;
    // }
    if (!this.accountService.branches.length) {
      this.getBranches();
    }
    if (!this.accountService.financialYears.length) {
    this.getFinancial();
    }
  }

  ngOnDestroy(){}

  getBranches() {
    this.api.post('Suggestion/GetBranchList', { search: 123 })
      .subscribe(res => {
        console.log('Branches :', res['data']);
        this.accountService.branches = res['data'];
        if (this.accountService.branches.length == 1) {
          console.log('_________________________TRUE');
          this.accountService.selected.branchId = this.accountService.branches[0].id;
          this.accountService.selected.branch = this.accountService.branches[0];
          this.getFinancial();
        } else {
          console.log('_________________________ELSE');
          this.accountService.selected.branchId = 0;
          this.accountService.selected.branch.id = 0;
          // this.accountService.selected.branch.name = ;

        }
        // this.accountService.selected.branch.id = this.accountService.selected.branchId;
      }, err => {
        console.log('Error: ', err);
      });
  }

  getFinancial() {
    this.api.post('Suggestion/GetFinancialYear', { search: 123 })
      .subscribe(res => {
        console.log('financial :', res['data']);
        this.accountService.financialYears = res['data'];
        // this.accountService.financialYears.map(financialYear => {
        //   if (financialYear.name.split('-')[0] == (new Date()).getFullYear()) {
        //     this.accountService.selected.financialYear = financialYear;
        //   }
        // });
        this.accountService.selected.financialYear = this.accountService.financialYears[this.accountService.financialYears.length-1];

        console.log('selected financial year',this.accountService.selected.financialYear);
      }, err => {
        this.getFinancial();
        console.log('Error: ', err);
      });
  }

  onKeyDown(event) {
    const keys = ['f4', 'f5', 'f6', 'f7', 'f8', 'f9','f1','f10','f11','f12'];
    const key = event.key.toLowerCase();
    const index = keys.indexOf(key);
    if(event.ctrlKey){
      let redirectUrl='';
      if(key == 1){
        redirectUrl='/accounts/daybooks/0';
      } else if(key == 2){
        redirectUrl='/accounts/ledgerview';
      }else if(key == 3){
        redirectUrl='/accounts/profitloss';
      }else if(key == 4){
        redirectUrl='/accounts/balancesheet';
      }else if(key == 5){
        redirectUrl='/accounts/trading';
      }else if(key == 6){
        redirectUrl='/accounts/trialbalance';
      }else if(key == 0){
        redirectUrl='/accounts/ledgermapping';
      }
      else if(key == 'f2'){
       // redirectUrl='/acounts-modals/range';
        const activeModal = this.modalService.open(RangeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
     // this.voucher.date = this.common.dateFormatternew(data.date).split(' ')[0];
      //  console.log('Date:', this.date);
       });
      }
      if(redirectUrl !=''){
            this.router.navigate([redirectUrl]);
            event.preventDefault();
      }
    }else if (index != -1) {
      const routes = {
        'f4': '/accounts/vouchers/-8/Contra Voucher',
        'f5': '/accounts/vouchers/-1/Bank Payment Voucher',
        'f6': '/accounts/vouchers/-3/Cash Payment Voucher',
        'f7': '/accounts/vouchers/-2/Bank Receipt Voucher',
        'f8': '/accounts/vouchers/-4/Cash Receipt Voucher',
        'f9': '/accounts/vouchers/-7/Journal Voucher',
        'f1': '/accounts/ledgers/0',
        'f10': '/accounts/trip-voucher-expense',
        'f11': '/accounts/trip-voucher-expense/1',
        'f12': '/accounts/fuelfillings',

      }
      let pressedKey = keys[index];
      console.log('Pressed Key:', pressedKey);
      this.router.navigate([routes[pressedKey]]);
      event.preventDefault();
    }
  }
}
