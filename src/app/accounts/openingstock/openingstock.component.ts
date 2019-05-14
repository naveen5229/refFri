import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'openingstock',
  templateUrl: './openingstock.component.html',
  styleUrls: ['./openingstock.component.scss']
})
export class OpeningstockComponent implements OnInit {
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
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
      return;
    }
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('date')) {
        this.openingstock.date = this.common.handleDateOnEnterNew(this.openingstock.date);
        this.setFoucus('submit');
      }

    }
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
        this.openingStocks = JSON.parse(res['data'][0]['get_rpt_openingstock']);
        // this.setFoucus('ordertype');
        // this.common.showToast('Invoice Are Saved');
        return;

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
