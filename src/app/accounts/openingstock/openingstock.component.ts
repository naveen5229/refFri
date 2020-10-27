import { Component, OnInit,HostListener} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'openingstock',
  templateUrl: './openingstock.component.html',
  styleUrls: ['./openingstock.component.scss'],
  
})
export class OpeningstockComponent implements OnInit {
   @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }
  openingStocks = [];
  stockdata = [];
  selectedRow = -1;
  selectedName = '';
  openingstock = {
    date: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-')


  };
  activeId = 'date';

  allowBackspace = true;



  showDateModal = false;
  f2Date = 'date';
  activedateid = '';
  lastActiveId = '';

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService) {
    this.common.currentPage = 'Opening Stock';
    this.setFoucus('date');
  }

  ngOnInit() {
  } 
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('date'))) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = this.activeId;
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } 
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('date')) {
        this.openingstock.date = this.common.handleDateOnEnterNew(this.openingstock.date);
        this.setFoucus('submit');
      }

    }
    //  else if ((this.activeId == 'date') && key !== 'backspace') {
    //   let regex = /[0-9]|[-]/g;
    //   let result = regex.test(key);
    //   if (!result) {
    //     event.preventDefault();
    //     return;
    //   }
    // }
    else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.openingStocks.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.openingStocks.length - 1) this.selectedRow++;

    }
  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'date') ? 'date' : 'date';
    if (this.openingstock[datestring].includes('-')) {
      dateArray = this.openingstock[datestring].split('-');
    } else if (this.openingstock[datestring].includes('/')) {
      dateArray = this.openingstock[datestring].split('/');
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
    this.openingstock[datestring] = date + separator + month + separator + year;
  }
  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();

    }, 100);
  }
  dismiss(response) {

    if (response) {

      this.getOpeningStock(this.openingstock);
    }
    // this.activeModal.close({ response: response, Voucher: this.order });
  }

  pdfFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1 + remainingstring3;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','');

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getCSVFromTableIdNew('table',foname,cityaddress,'','',remainingstring3);
      // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  getOpeningStock(openingstock) {
    const params = {
      date: openingstock.date
    }

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/OpeningStock', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.GetLedger();
        this.openingStocks = res['data'];
        // this.setFoucus('ordertype');
        // this.common.showToast('Invoice Are Saved');
       // return;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }





}
