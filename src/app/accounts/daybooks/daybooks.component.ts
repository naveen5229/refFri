import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import {VoucherdetailComponent}from '../../acounts-modals/voucherdetail/voucherdetail.component';

@Component({
  selector: 'daybooks',
  templateUrl: './daybooks.component.html',
  styleUrls: ['./daybooks.component.scss']
})
export class DaybooksComponent implements OnInit {
  selectedName='';
  DayBook = {
    enddate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    ledger: {
      name: '',
      id: 0
    },
    branch: {
      name: '',
      id: 0
    },
    vouchertype: {
      name: '',
      id: 0
    },
    issumrise:'true'

  };
  vouchertypedata = [];
  branchdata = [];
  DayData = [];
  activeId = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getVoucherTypeList();
    this.getBranchList();
    this.setFoucus('branch');
  }

  ngOnInit() {
  }

  getVoucherTypeList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetVouchertypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.vouchertypedata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getBranchList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.branchdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getDayBook() {
    console.log('Accounts:', this.DayBook);
    let params = {
      startdate: this.DayBook.startdate,
      enddate: this.DayBook.enddate,
      ledger: this.DayBook.ledger.id,
      branch: this.DayBook.branch.id,
      vouchertype: this.DayBook.vouchertype.id,
    };

    this.common.loading++;
    this.api.post('Company/GetDayBook', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.DayData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.DayBook[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log(this.DayBook[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.DayBook[type].name = selectedData[display];
    this.DayBook[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }

  handleVoucherDateOnEnter() {
    let dateArray = [];
    let separator = '-';
    /* if (this.voucher.date.includes('-')) {
       dateArray = this.voucher.date.split('-');
     } else if (this.voucher.date.includes('/')) {
       dateArray = this.voucher.date.split('/');
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
     this.voucher.date = date + separator + month + separator + year;
    */

  }

  filterData(dayDatas) {
    let yCodes = [];
    dayDatas.map(dayData =>{
      if(yCodes.indexOf(dayData.y_code) !== -1){
        dayData.y_code = ' ';
        dayData.y_date = 0;
      }else{
       
        //yCodes.push(dayData.y_date);

       // dataItem.y_date | date : 'dd MMM yyyy'
      }
    });
    return dayDatas;
  }

  getBookDetail(voucherId){
console.log('vouher id',voucherId);
this.common.params = voucherId;

    const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static',keyboard :false});
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
       return;
      //   if (stocksubType) {
         
      //     this.updateStockSubType(stocksubType.id, data.stockSubType);
      //     return;
      //   }
      //  this.addStockSubType(data.stockSubType)
      }
    });
  }

  RowSelected(u:any){
    console.log('data of u',u);
   this.selectedName=u;   // declare variable in component.
    }

    
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
      if (this.activeId.includes('branch')) {
        this.setFoucus('vouchertype');
      }else  if (this.activeId.includes('vouchertype')) {
        this.setFoucus('ledger');
      }else  if (this.activeId.includes('ledger')) {
        this.setFoucus('startdate');
      }else  if (this.activeId.includes('startdate')) {
        this.setFoucus('enddate');
      }else  if (this.activeId.includes('enddate')) {
        this.setFoucus('submit');
      }
    }
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

}
