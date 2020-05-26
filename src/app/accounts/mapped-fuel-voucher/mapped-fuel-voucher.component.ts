import { Component, OnInit, HostListener } from '@angular/core';
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
    startdate: this.common.dateFormatternew(new Date().setDate(new Date().getDate() - 2), 'ddMMYYYY', false, '-'),
    // startdate: this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-'),
    type: 1
  };
  activeId = '';
  showTable = false;
  // showDateModal = false;
  voucherDetails = [];
  mappedDetails = [];
  mappedVoucher = [];
  selectedRow = -1;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }
  showDateModal = false;
  f2Date = '';
  activedateid = '';
  allowBackspace = true;
  lastActiveId= 'startdate';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public accountService: AccountService,
    public modalService: NgbModal
  ) {
    // this.common.refresh = this.refresh.bind(this);
    this.common.currentPage = 'Mapped Fuel Voucher';
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
          this.showTable = true;
          if (this.fuelVoucher.type == 1) {
            this.getVoucherGroup(this.voucherDetails);
          }
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
 changeModal(changevalue){
  console.log('hello',changevalue);
  this.voucherDetails = [];
  this.mappedDetails = [];
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

  
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
     if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }
    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = this.fuelVoucher[this.activeId];
      this.activedateid = this.lastActiveId;
      return;
    }else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleOrderDateOnEnter(this.activeId);
      this.setFoucus('enddate');

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      return;
    }
    if (key.includes('arrow')) {
      this.allowBackspace = false;
      event.preventDefault();
    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.voucherDetails.length) {
     
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.voucherDetails.length - 1) this.selectedRow++;

    }
  }
    if (key == 'enter') {
          if (this.activeId.includes('startdate')) {
            this.setFoucus('enddate');
          } else if (this.activeId.includes('enddate')) {
            this.setFoucus('submit');
          }
        }

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
  handleOrderDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startdate') ? 'startdate' : 'enddate';
    if (this.f2Date.includes('-')) {
      dateArray = this.f2Date.split('-');
    } else if (this.f2Date.includes('/')) {
      dateArray = this.f2Date.split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    console.log('Date: ', date + separator + month + separator + year);
    this.fuelVoucher[datestring] = date + separator + month + separator + year;
    console.log('data parameter',datestring,this.fuelVoucher);
  }
  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
     // this.setAutoSuggestion();
    }, 100);
  }


}
