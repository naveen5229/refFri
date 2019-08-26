import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { ProfitlossComponent } from '../profitloss/profitloss.component';
import * as _ from 'lodash';
import { CostCenterViewComponent } from '../../acounts-modals/cost-center-view/cost-center-view.component';

@Component({
  selector: 'cost-center-report',
  templateUrl: './cost-center-report.component.html',
  styleUrls: ['./cost-center-report.component.scss']
})
export class CostCenterReportComponent implements OnInit {
  selectedName = '';

  trial = {
    endDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startDate: this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    voucherType: {
      name: 'All',
      id: 0
    }

  };

  costCenterData = [];
  ledgerList = [];
  activeId = 'voucherType';
  selectedRow = -1;
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  activedateid = '';
  lastActiveId = '';
  trialBalanceData = [];
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);

    //this.getVoucherTypeList();
    // this.getLedgerList();
    this.setFoucus('startDate');
    this.common.currentPage = 'Cost Category Report';
  }

  ngOnInit() {
  }
  refresh() {
    // this.getVoucherTypeList();
    // this.getLedgerList();
    this.setFoucus('startDate');
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
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','','Cost Category From :'+this.trial.startDate+' To :'+this.trial.endDate);

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

  getTrial() {
    console.log('Ledger:', this.trial);
    let params = {
      startdate: this.trial.startDate,
      enddate: this.trial.endDate
    };

    this.common.loading++;
    this.api.post('Accounts/getCostCenterSummary', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.costCenterData = res['data'];
        this.formattData();
        if (this.costCenterData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  formattData() {
    let firstGroup = _.groupBy(this.costCenterData, 'y_parent_costcentername');
    this.trialBalanceData = [];
    for (let key in firstGroup) {
      let groups = _.groupBy(firstGroup[key], 'y_parent_costcentername');
      let traildatas = [];
      let totalopening = 0;
      let totaldr = 0;
      let totalcr = 0;
      let totalclosing = 0;
      let y_closebaltype = '';
      let y_openbaltype = '';
      for (let groupKey in groups) {

        groups[groupKey].map(info => {
          if (info.y_openbal) totalopening += parseInt(info.y_openbal);
          if (info.y_dr_amt) totaldr += parseInt(info.y_dr_amt);
          if (info.y_cr_amt) totalcr += parseInt(info.y_cr_amt);
          if (info.y_close_amt) totalclosing += parseInt(info.y_close_amt);
          y_closebaltype = info.y_closebaltype;
          y_openbaltype = info.y_openbaltype;
          traildatas.push(info);
        });
      }

      this.trialBalanceData.push({
        name: key,
        totalopening,
        totaldr,
        totalcr,
        totalclosing,
        y_openbaltype,
        y_closebaltype,
        traildatas
      });
    }




    console.log('First Section:', this.trialBalanceData);
    console.log('Second Section:', this.trialBalanceData);
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.trial[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.trial[date]);
    });
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter' && !this.activeId && this.costCenterData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.costCenterData[this.selectedRow].y_costcenter_id);
      return;
    }
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
      if (this.activeId.includes('voucherType')) {
        this.setFoucus('ledger');
      } else if (this.activeId.includes('ledger')) {
        this.setFoucus('startDate');
      } else if (this.activeId.includes('startDate')) {
        this.trial.startDate = this.common.handleDateOnEnterNew(this.trial.startDate);
        this.setFoucus('endDate');
      } else if (this.activeId.includes('endDate')) {
        this.trial.endDate = this.common.handleDateOnEnterNew(this.trial.endDate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'endDate') this.setFoucus('startDate');
      if (this.activeId == 'startDate') this.setFoucus('ledger');
      if (this.activeId == 'ledger') this.setFoucus('voucherType');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startDate' || this.activeId == 'endDate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }else if (key != 'backspace') {
      this.allowBackspace = false;
    }

    else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.costCenterData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.costCenterData.length - 1) this.selectedRow++;

    }
  }


  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.trial[datestring].includes('-')) {
      dateArray = this.trial[datestring].split('-');
    } else if (this.trial[datestring].includes('/')) {
      dateArray = this.trial[datestring].split('/');
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
    this.trial[datestring] = date + separator + month + separator + year;
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


  getBookDetail(costCenterId) {
    console.log('cost Center id', costCenterId);
    //  this.common.params = voucherId;
    this.common.params = {
      startdate: this.trial.startDate,
      enddate: this.trial.endDate,
      costCenterId: costCenterId,

    };

    const activeModal = this.modalService.open(CostCenterViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
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

  getProfitLoss() {
    this.common.params = {
      startdate: this.trial.startDate,
      enddate: this.trial.endDate
    };
    console.log('start date and date', this.common.params);
    //  this.common.params = voucherId;

    const activeModal = this.modalService.open(ProfitlossComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        return;

      }
    });
  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }
}

