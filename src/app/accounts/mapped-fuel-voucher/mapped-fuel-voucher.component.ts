import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'mapped-fuel-voucher',
  templateUrl: './mapped-fuel-voucher.component.html',
  styleUrls: ['./mapped-fuel-voucher.component.scss']
})
export class MappedFuelVoucherComponent implements OnInit {

  fuelVoucher = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-'),
    type: 1
  };
  activeId = '';
  showDateModal = false;
  voucherDetails = [];
  mappedDetails = [];
  mappedVoucher = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public accountService: AccountService,
    public modalService: NgbModal
  ) {
    // this.common.refresh = this.refresh.bind(this);
    this.getFuelVoucher();
  }

  ngOnInit() {
  }

  getFuelVoucher() {
    this.voucherDetails = [];
    this.mappedDetails = [];
    let type;
    let startdate = this.fuelVoucher.startdate;
    startdate = this.handleDateOnSubmit(startdate);
    let enddate = this.fuelVoucher.enddate;
    enddate = this.handleDateOnSubmit(enddate);
    console.log('start end', startdate, enddate);
    this.fuelVoucher.startdate = this.common.handleDateOnEnterNew(this.fuelVoucher.startdate);
    this.fuelVoucher.enddate = this.common.handleDateOnEnterNew(this.fuelVoucher.enddate);
    console.log('start and end', this.fuelVoucher.startdate, this.fuelVoucher.enddate);
    if (this.fuelVoucher.type == 0) {
      type = false;
    } else {
      type = true;
    }
    let params = {
      startDate: startdate,
      endDate: enddate,
      type: '' + type
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('Accounts/getMappedFuelVoucher', params)
      .subscribe(res => {
        this.common.loading--
        console.log('res', res['data']);

        if (res['data'] == null) {
          this.common.showToast('Record Empty !!');;
        }
        else {
          this.voucherDetails = res['data'];
          if (this.fuelVoucher.type == 1) {
            this.getVoucherGroup(this.voucherDetails);
          }
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  handleDateOnSubmit(datestr) {
    let dateArray = [];
    let separator = '-';
    let dateString = datestr;
    if (dateString.includes('-')) {
      dateArray = dateString.split('-');
    } else if (dateString.includes('/')) {
      dateArray = dateString.split('/');
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    console.log('Date: ', date + separator + month + separator + year);
    dateString = year + separator + month + separator + date;
    return dateString;

  }
  // keyHandler(event) {
  //   const key = event.key.toLowerCase();
  //   this.activeId = document.activeElement.id;
  //   console.log('Active event', event);

  //   if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
  //     document.getElementById("voucher-date").focus();
  //     this.voucher.date = '';
  //    this.lastActiveId = this.activeId;
  //     this.setFoucus('voucher-date-f2', false);
  //     this.showDateModal = true;
  //     this.f2Date = this.activeId;
  //     this.activedateid = this.lastActiveId;
  //     return;
  //   } else if ((key == 'enter' && this.showDateModal)) {
  //     this.showDateModal = false;
  //     console.log('Last Ac: ', this.lastActiveId);
  //     this.handleVoucherDateOnEnter(this.activeId);
  //     this.setFoucus(this.lastActiveId);

  //     return;
  //   } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
  //     return;
  //   }

  //   if (key == 'enter') {
  //     this.allowBackspace = true;
  //     if (this.activeId.includes('ledger')) {
  //       this.setFoucus('startDate');
  //     } else if (this.activeId.includes('startDate')) {
  //       this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
  //       this.setFoucus('endDate');
  //     } else if (this.activeId.includes('endDate')) {
  //       this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
  //       this.setFoucus('submit');
  //     }
  //   }
  //   else if (key == 'backspace' && this.allowBackspace) {
  //     event.preventDefault();
  //     console.log('active 1', this.activeId);
  //     if (this.activeId == 'endDate') this.setFoucus('startDate');
  //     if (this.activeId == 'startDate') this.setFoucus('ledger');
  //   } else if (key.includes('arrow')) {
  //     this.allowBackspace = false;
  //   } else if (key != 'backspace') {
  //     this.allowBackspace = false;
  //   }
  //   if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.voucherEntries.length) {
  //     /************************ Handle Table Rows Selection ********************** */
  //     if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
  //     else if (this.selectedRow != this.voucherEntries.length - 1) this.selectedRow++;

  //   }
  // }

  getVoucherGroup(voucher) {
    let voucherGroup = _.groupBy(voucher, 'voucher_no');
    this.mappedDetails = [];
    Object.keys(voucherGroup).map(voucherName => {
      this.mappedDetails.push({
        voucherName,
        date: voucherGroup[voucherName][0].voucher_date,
        amount: voucherGroup[voucherName][0].voucher_amount,
        details: voucherGroup[voucherName]
      })
    });
    console.log('VoucheL:::::::::::::', voucherGroup, this.mappedDetails);

  }


}
