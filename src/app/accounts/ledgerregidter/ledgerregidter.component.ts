import { Component, OnInit, Input } from '@angular/core';
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
import { TripdetailComponent } from '../../acounts-modals/tripdetail/tripdetail.component';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';


@Component({
  selector: 'ledger-register-tree',
  template: `
  <div *ngIf="active">
    <div *ngFor="let d of data let i = index">
      <div style="cursor:pointer"  *ngIf="d.name"  class="row x-sub-stocktype" (click)="activeIndex = activeIndex !== i ? i : -1">
          <div class="col x-col" style="text-align:left;margin-left: 20px;">{{labels}} {{d.name}}</div>
      </div>
      <ledger-register-tree *ngIf="d.name" [data]="d.data" [active]="activeIndex === i ? true : false" [labels]="labels"></ledger-register-tree>
      <div *ngIf="!d.name"  class="row x-warehouse">
        <div class="col x-col">&nbsp;</div>
        <div class="col x-col">{{d.y_ledger_name}}</div>
        <div class="col x-col">{{d.y_voucher_code}}</div>
        <div class="col x-col">{{d.y_voucher_cust_code}}</div>
        <div class="col x-col">{{d.y_voucher_date | date:'dd-MMM-yy'}}</div>
        <div class="col x-col">{{d.y_voucher_type_name}}e</div>
        <div class="col x-col">{{d.y_dramunt}}</div>
        <div class="col x-col">{{d.y_cramunt}}</div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./ledgerregidter.component.scss']
})
export class ledgerRegisterTreeComponent {
  @Input() data: any;
  @Input() active: boolean;
  @Input() labels: string;
  activeIndex: boolean = false;
}

@Component({
  selector: 'ledgerregidter',
  templateUrl: './ledgerregidter.component.html',
  styleUrls: ['./ledgerregidter.component.scss']

})
export class LedgerregidterComponent implements OnInit {
  activeTree = -1;
  Ledgerregister = [];
  selectedName = '';
  deletedId = 0;
  pageName = "";
  sizeledger = 0;
  voucherEntries = [];
  ledgerRegister = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: ((((new Date()).getMonth()) + 1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear()) - 1) + '-04-01', 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    group: {
      name: 'All',
      id: 0
    },
    vouchertype: {
      name: 'All',
      id: 0
    },
    isamount: 0,
    remarks: '',
    vouchercustcode: '',
    vouchercode: '',
    frmamount: 0,
    toamount: 0,

  };
  activeId = 'vouchertype';
  activedateid = '';

  vouchertypedata = [];
  ledgerData = [];
  secondarygroup = [];
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  lastActiveId = '';
  selectedRow = -1;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public csvService: CsvService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);



    if (this.common.params && this.common.params.pageName) {
      this.pageName = this.common.params.pageName;
      this.deletedId = 0;
      this.GetLedger();
      this.sizeledger = 1;
    }
    this.common.currentPage = (this.deletedId == 2) ? 'Cost Category Ledger' : 'Ledger';
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 0);
    this.getVoucherTypeList();
    this.getAllLedger();
    this.getSecondaryGoup();
  }

  ngOnInit() {
  }
  refresh() {
    this.GetLedger();
  }
  getAllLedger() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getVoucherTypeList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetVouchertypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res======:', res['data']);
        this.vouchertypedata = res['data'];
        this.vouchertypedata.push({ id: -1001, name: 'Stock Received' }, { id: -1002, name: 'Stock Transfer' }, { id: -1003, name: 'Stock Issue' }, { id: -1004, name: 'Stock Transfer Received' });
        console.log('res type list', this.vouchertypedata);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getSecondaryGoup() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Accounts/getSecondaryGoup', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.secondarygroup = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  GetLedger() {
    let params = {
      foid: 123,
      deleted: this.deletedId
    };
    console.log('deleted ledger and simple', params);
    this.common.loading++;
    this.api.post('Accounts/GetLedgerdata', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.Ledgerregister = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getDetail() {
    let params = {
      ledgerid: this.ledgerRegister.ledger.id,
      vouchertyid: this.ledgerRegister.vouchertype.id,
      groupid: this.ledgerRegister.group.id,
      startDate: this.ledgerRegister.startdate,
      endDate: this.ledgerRegister.startdate,
      isamount: this.ledgerRegister.isamount,
      remarks: this.ledgerRegister.remarks,
      vouchercustcode: this.ledgerRegister.vouchercustcode,
      vouchercode: this.ledgerRegister.vouchercode,
      frmamount: this.ledgerRegister.frmamount,
      toamount: this.ledgerRegister.toamount,
    };
    this.common.loading++;
    this.api.post('Accounts/getLedgerRegister', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.Ledgerregister = res['data'];
        this.generalizeData();
        this.common.showToast(res['data'][0].y_errormsg);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  generalizeData() {
    this.voucherEntries = [];
    for (let i = 0; i < this.Ledgerregister.length; i++) {
      let ledgerRegister = this.Ledgerregister[i];
      let labels = ledgerRegister.y_path.split('-->');
      ledgerRegister.labels = labels.splice(1, labels.length);
      let index = this.voucherEntries.findIndex(voucher => voucher.name === labels[0]);
      if (index === -1) {
        this.voucherEntries.push({
          name: labels[0],
          data: [ledgerRegister]
        })
      } else {
        this.voucherEntries[index].data.push(ledgerRegister);
      }
    }

    this.voucherEntries.map(voucher => voucher.data = this.findChilds(voucher.data));
    console.log('voucherEntries', this.voucherEntries);
  }

  findChilds(data) {
    let childs = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].labels.length) {
        let ledgerRegister = data[i];
        let labels = ledgerRegister.labels;
        ledgerRegister.labels = labels.splice(1, labels.length);
        let index = childs.findIndex(voucher => voucher.name === labels[0]);
        if (index === -1) {
          childs.push({
            name: labels[0],
            data: [ledgerRegister]
          })
        } else {
          childs[index].data.push(ledgerRegister);
        }
      }
    }
    if (childs.length) {
      return childs.map(child => {
        return {
          name: child.name,
          data: this.findChilds(child.data)
        }
      });
    } else {
      return data;
    }
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
        this.ledgerRegister.startdate = this.common.handleDateOnEnterNew(this.ledgerRegister.startdate);
        this.setFoucus('endDate');
      } else if (this.activeId.includes('endDate')) {
        this.setFoucus('groupid');
      } else if (this.activeId.includes('endDate')) {
        this.ledgerRegister.enddate = this.common.handleDateOnEnterNew(this.ledgerRegister.enddate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'groupid') this.setFoucus('endDate');
      if (this.activeId == 'endDate') this.setFoucus('startDate');
      if (this.activeId == 'startDate') this.setFoucus('ledger');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startDate' || this.activeId == 'endDate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.Ledgerregister.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.Ledgerregister.length - 1) this.selectedRow++;

    }
  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
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
  // modelCondition() {
  //   this.activeModal.close({ });
  //   event.preventDefault();
  //   return;
  // }
  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.ledgerRegister[datestring].includes('-')) {
      dateArray = this.ledgerRegister[datestring].split('-');
    } else if (this.ledgerRegister[datestring].includes('/')) {
      dateArray = this.ledgerRegister[datestring].split('/');
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
    this.ledgerRegister[datestring] = date + separator + month + separator + year;
  }
  onSelected(selectedData, type, display) {
    this.ledgerRegister[type].name = selectedData[display];
    this.ledgerRegister[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }
}

