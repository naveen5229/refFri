import { Component, OnInit, HostListener } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { VoucherdetailComponent } from '../voucherdetail/voucherdetail.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'cost-center-view',
  templateUrl: './cost-center-view.component.html',
  styleUrls: ['./cost-center-view.component.scss']
})
export class CostCenterViewComponent implements OnInit {
  vouchertypedata = [];
  branchdata = [];

  ledger = {
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
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    // this.keyHandler(event);
  }


  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    if (this.common.params) {
      console.log("After the modal Open:", this.common.params);
      this.ledger = {
        endDate: this.common.params.enddate,
        startDate: this.common.params.startdate,
        ledger: {
          name: 'All',
          id: this.common.params.costCenterId
        },
        branch: {
          name: '',
          id: ''
        },
        voucherType: {
          name: 'All',
          id: 0
        }

      }
      this.getLedgerView();
    }
    this.common.handleModalSize('class', 'modal-lg', '1250');

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    this.getVoucherTypeList();
    this.getLedgerList();
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
    console.log('Ledger:', this.ledger);
    let params = {
      startdate: this.ledger.startDate,
      enddate: this.ledger.endDate,
      costcenterid: this.ledger.ledger.id,

    };

    this.common.loading++;
    this.api.post('Accounts/getCostCenterView', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.costCenterData = res['data'];
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
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.ledger[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.ledger[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.ledger[type].name = selectedData[display];
    this.ledger[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }



  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.ledger[datestring].includes('-')) {
      dateArray = this.ledger[datestring].split('-');
    } else if (this.ledger[datestring].includes('/')) {
      dateArray = this.ledger[datestring].split('/');
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
    this.ledger[datestring] = date + separator + month + separator + year;
  }
  // setFoucus(id, isSetLastActive = true) {
  //   setTimeout(() => {
  //     let element = document.getElementById(id);
  //     console.log('Element: ', element);
  //     element.focus();
  //     // this.moveCursor(element, 0, element['value'].length);
  //     // if (isSetLastActive) this.lastActiveId = id;
  //     // console.log('last active id: ', this.lastActiveId);
  //   }, 100);
  // }


  getBookDetail(voucherId,vouhercode) {
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
  modelCondition() {
    // this.showConfirm = false;
    this.activeModal.close({ response: true });
    event.preventDefault();
    return;
  }
}

