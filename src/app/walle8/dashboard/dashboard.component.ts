import { Component, OnInit } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  balance = [];
  total = [];
  remainingBalance = null;
  tollDiscount = null;
  fuelDiscount = null;
  Total = 0;
  // mobileno = this.user._details.mobileno;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    this.getdiscount();
    this.getTotal();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.getdiscount();
    this.getTotal();
  }
  getdiscount() {
    console.log('Mobileno:', this.user._details);
    let param = "mobileno=" + this.user._details.fo_mobileno;
    this.common.loading++;
    this.api.walle8Get('CardRechargeApi/AccountRemainingAmount.json?' + param)
      .subscribe(Res => {
        this.common.loading--;
        console.log('Res:', Res);
        this.balance = Res['data'];
        this.remainingBalance = this.balance[0].toll_balance;
        //this.tollDiscount = this.balance[0].toll_balance;
        console.log('discount', this.remainingBalance);
        console.log('.......', this.tollDiscount);


      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getTotal() {

    let param = "mobileno=" + this.user._details.fo_mobileno;
    this.common.loading++;
    this.api.walle8Get('DiscountApi/ViewFoDiscount.json?' + param)
      .subscribe(Res => {
        this.common.loading--;
        console.log('Res:', Res);
        this.total = Res['data'];
        this.fuelDiscount = this.total[0].fd;
        this.tollDiscount = this.total[0].td;

        this.Total = parseInt(this.fuelDiscount) + parseInt(this.tollDiscount);


      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
