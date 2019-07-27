import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { CsvService } from '../../services/csv/csv.service';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { OrderdetailComponent } from '../../acounts-modals/orderdetail/orderdetail.component';


@Component({
  selector: 'outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.scss']
})
export class OutstandingComponent implements OnInit {
  vouchertypedata = [];
  branchdata = [];
  activedateid = '';
  selectedName = '';
  outStanding = {
    endDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    branch: {
      name: '',
      id: ''
    },
    trantype: 0
  };

  ledgerData = [];
  voucherEntries = [];
  ledgerList = [];
  activeId = 'ledger';
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  lastActiveId = '';
  headingName = '';
  selectedRow = -1;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public csvService: CsvService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getLedgerList();
    this.setFoucus('ledger');
    this.common.currentPage = 'Outstanding Report';
    this.headingName = this.user._customer.name + '( ' + this.accountService.selected.branch.name + ' ) From :' + this.outStanding.startDate + ' To ' + this.outStanding.endDate;
  }

  ngOnInit() {
  }
  refresh() {
    this.getLedgerList();
    this.setFoucus('ledger');
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
  getLedgerList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerList = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getLedgerView() {
    console.log('Ledger:', this.outStanding);
    let params = {
      startdate: this.outStanding.startDate,
      enddate: this.outStanding.endDate,
      ledger: this.outStanding.ledger.id,
      branch: this.outStanding.branch.id,
      trantype: this.outStanding.trantype
    };

    this.common.loading++;
    this.api.post('Accounts/GetOutStandingList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        this.generalizeData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.outStanding[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.outStanding[date]);
    });
  }

  openVoucherDetail(voucherId,vouhercode) {
    console.log('vouher id', voucherId);
    this.common.params={

      vchid :voucherId,
      vchcode:vouhercode
    }
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
  openinvoicemodel(voucherId) {
      this.common.params = {
        invoiceid: voucherId,
        delete: 0,
        indexlg:0
      };
      const activeModal = this.modalService.open(OrderdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          console.log('open succesfull');
  
          // this.addLedger(data.ledger);
        }
      });
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
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','','Out Standing From :'+this.outStanding.startDate+' To :'+this.outStanding.endDate);

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
  onSelected(selectedData, type, display) {
    this.outStanding[type].name = selectedData[display];
    this.outStanding[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }


  filterData(dayDatas) {
    let yCodes = [];
    // dayDatas.map(dayData => {
    //   if (yCodes.indexOf(dayData.y_particulars) !== -1) {
    //     dayData.y_particulars = 0;
    //   } else {
    //     yCodes.push(dayData.y_particulars);
    //   }
    // });
    return dayDatas;
  }

  generalizeData() {
    this.voucherEntries = [];
    let allGroups = _.groupBy(this.ledgerData, 'y_particulars');
    let allKeys = Object.keys(allGroups);
    allKeys.map((key, index) => {
      this.voucherEntries[index] = {
        name: key,
        amount: {
          debit: 0,
          credit: 0
        },
        vouchers: allGroups[key]
      };
      allGroups[key].map(data => {
        this.voucherEntries[index].amount.debit += parseFloat(data.y_dramunt);
        this.voucherEntries[index].amount.credit += parseFloat(data.y_cramunt);
      });
    });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);

    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
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
      if (this.activeId.includes('ledger')) {
        this.setFoucus('startDate');
      } else if (this.activeId.includes('startDate')) {
        this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('endDate');
      } else if (this.activeId.includes('endDate')) {
        this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'endDate') this.setFoucus('startDate');
      if (this.activeId == 'startDate') this.setFoucus('ledger');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.voucherEntries.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.voucherEntries.length - 1) this.selectedRow++;

    }
  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.outStanding[datestring].includes('-')) {
      dateArray = this.outStanding[datestring].split('-');
    } else if (this.outStanding[datestring].includes('/')) {
      dateArray = this.outStanding[datestring].split('/');
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
    this.outStanding[datestring] = date + separator + month + separator + year;
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
