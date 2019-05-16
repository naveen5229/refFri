import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';

@Component({
  selector: 'cost-center-report',
  templateUrl: './cost-center-report.component.html',
  styleUrls: ['./cost-center-report.component.scss']
})
export class CostCenterReportComponent implements OnInit {
  selectedName = '';
  DayBook = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    branch: {
      name: 'All',
      id: 0
    },
    vouchertype: {
      name: 'All',
      id: 0
    },
    issumrise: 'true'

  };
  vouchertypedata = [];
  branchdata = [];
  DayData = [];
  ledgerData = [];
  activeId = 'startdate';
  selectedRow = -1;
  allowBackspace = true;


  f2Date = 'startdate';
  lastActiveId = '';
  showDateModal = false;
  activedateid = '';


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);

    this.getAllLedger();
    this.setFoucus('startdate');
    this.common.currentPage = 'CostCenter-Report';



  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  refresh() {
    this.getAllLedger();
    this.setFoucus('startdate');
  }



  openinvoicemodel(invoiceid) {
    this.common.params = invoiceid;
    const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        console.log('open succesfull');

      }
    });
  }



  getAllLedger() {
    let url = 'Suggestion/GetLedger?transactionType=' + 'credit' + '&voucherId=' + (-3) + '&search=' + 'test';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.ledgerData = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
    this.setFoucus('ref-code');
  }
  getDayBook() {
    console.log('Accounts:', this.DayBook);
    let params = {
      startdate: this.DayBook.startdate,
      enddate: this.DayBook.enddate,
      ledger: this.DayBook.ledger.id,
      branchId: this.DayBook.branch.id,
      vouchertype: this.DayBook.vouchertype.id,
    };

    this.common.loading++;
    this.api.post('Company/GetCashBook', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.DayData = res['data'];
        this.filterData();
        if (this.DayData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.DayBook[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.DayBook[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.DayBook[type].name = selectedData[display];
    this.DayBook[type].id = selectedData.y_ledger_id;
    console.log('Selected Data: ', selectedData, type, display);
    console.log('order User: ', this.DayBook);
  }
  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startdate') ? 'startdate' : 'enddate';
    if (this.DayBook[datestring].includes('-')) {
      dateArray = this.DayBook[datestring].split('-');
    } else if (this.DayBook[datestring].includes('/')) {
      dateArray = this.DayBook[datestring].split('/');
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
    this.DayBook[datestring] = date + separator + month + separator + year;
  }

  filterData() {
    let yCodes = [];
    this.DayData.map(dayData => {
      if (yCodes.indexOf(dayData.y_code) !== -1) {
        dayData.y_code = ' ';
        dayData.y_date = 0;
      }
    });
  }

  getBookDetail(voucherId) {
    console.log('vouher id', voucherId);
    this.common.params = voucherId;

    const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
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

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event, this.activeId);
    if (key == 'enter' && !this.activeId && this.DayData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.DayData[this.selectedRow].y_ledger_id);
      return;
    }

    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
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
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('startdate')) {
        this.DayBook.startdate = this.common.handleDateOnEnterNew(this.DayBook.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.DayBook.enddate = this.common.handleDateOnEnterNew(this.DayBook.enddate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }

    else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.DayData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.DayData.length - 1) this.selectedRow++;

    }
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();

    }, 100);
  }

  test(e) {
    console.log('--------: ', e);
  }
}
