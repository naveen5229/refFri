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
import { PdfService } from '../../services/pdf/pdf.service';

@Component({
  selector: 'ledger-register-tree',
  template: `
  <div *ngIf="active">
    <div *ngFor="let d of data let i = index">
      <div style="cursor:pointer"  *ngIf="d.name"  class="row x-sub-stocktype" (click)="activeIndex = activeIndex !== i ? i : -1">
          <div class="col x-col" *ngIf="d.name">&nbsp;&nbsp;{{labels}} {{d.name}} </div>
          <div class="col x-col" *ngIf="d.name" >&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name" style="text-align:right;"> {{d.debit | number : '1.2-2'}} </div>
          <div class="col x-col" *ngIf="d.name" style="text-align:right;"> {{d.credit | number : '1.2-2'}} </div>
         
      </div>
      <ledger-register-tree *ngIf="d.name" [action]="action" [data]="d.data" [active]="activeIndex === i ? true : false" [labels]="labels"></ledger-register-tree>
      <div *ngIf="!d.name"  class="row x-warehouse" (dblclick)="(d.y_voucher_type_name.toLowerCase().includes('voucher'))  ? (d.y_voucher_type_name.toLowerCase().includes('trip')) ? action(d,'',d.y_voucher_type_name) :action(d.y_voucherid,d.y_code,d.y_voucher_type_name) : action(d.y_voucherid,'',d.y_voucher_type_name)" (click)="selectedRow = i" [ngClass]="{'highlight' : selectedRow == i }">
        <div class="col x-col">&nbsp;</div>
        <div class="col x-col">{{d.y_ledger_name}}</div>
        <div class="col x-col">{{d.y_code}}</div>
        <div class="col x-col">{{d.y_voucher_cust_code}}</div>
        <div class="col x-col">{{d.y_voucher_date | date:'dd-MMM-yy'}}</div>
        <div class="col x-col">{{d.y_voucher_type_name}}</div>
        <div class="col x-col" style="text-align:right;">{{d.y_dramunt | number : '1.2-2'}}</div>
        <div class="col x-col" style="text-align:right;">{{d.y_cramunt | number : '1.2-2'}}</div>
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
  @Input() action:any;
  activeIndex: boolean = false;
  selectedRow:number = -1;

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
  TripEditData = [];
  VoucherEditTime = [];
  pendingDataEditTme = [];
  tripExpDriver = [];
  tripExpenseVoucherTrips = [];

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
    public pdfService: PdfService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);



    if (this.common.params && this.common.params.pageName) {
      this.pageName = this.common.params.pageName;
      this.deletedId = 0;
      this.GetLedger();
      this.sizeledger = 1;
    }
    this.common.currentPage =  'Ledger Register';
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
          data: [ledgerRegister],
          debit: parseFloat(ledgerRegister.y_dramunt),
          credit: parseFloat(ledgerRegister.y_cramunt)
        })
      } else {
        this.voucherEntries[index].debit += parseFloat(ledgerRegister.y_dramunt);
        this.voucherEntries[index].credit += parseFloat(ledgerRegister.y_cramunt);
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
        console.log('ledgerRegister', ledgerRegister, i);
        let labels = ledgerRegister.labels;
        ledgerRegister.labels = labels.splice(1, labels.length);
        let index = childs.findIndex(voucher => voucher.name === labels[0]);
        if (index === -1) {
          childs.push({
            name: labels[0],
            data: [ledgerRegister],
            debit: parseFloat(ledgerRegister.y_dramunt),
            credit: parseFloat(ledgerRegister.y_cramunt)
          })
        } else {
          childs[index].debit += parseFloat(ledgerRegister.y_dramunt);
          childs[index].credit += parseFloat(ledgerRegister.y_cramunt);
          childs[index].data.push(ledgerRegister);
        }
      }
    }
    if (childs.length) {
      return childs.map(child => {
        return {
          name: child.name,
          data: this.findChilds(child.data),
          debit: child.debit,
          credit: child.credit
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
      if (this.activeId.includes('vouchertype')) {
        this.setFoucus('ledgerdaybook');
      } else if (this.activeId.includes('ledgerdaybook')) {
        this.setFoucus('group');
      } else if (this.activeId.includes('group')) {
        this.setFoucus('trantype');
      } else if (this.activeId.includes('frmamount')) {
        this.setFoucus('toamount');
      } else if (this.activeId.includes('toamount')) {
        this.setFoucus('vouchercode');
      } else if (this.activeId.includes('vouchercode')) {
        this.setFoucus('vouchercustcode');
      } else if (this.activeId.includes('vouchercustcode')) {
        this.setFoucus('remarks');
      } else if (this.activeId.includes('remarks')) {
        this.setFoucus('trantype');
      } else if (this.activeId.includes('trantype')) {
        this.setFoucus('frmamount');
      } else if (this.activeId.includes('startdate')) {
        this.ledgerRegister.startdate = this.common.handleDateOnEnterNew(this.ledgerRegister.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.ledgerRegister.enddate = this.common.handleDateOnEnterNew(this.ledgerRegister.enddate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
      if (this.activeId == 'startdate') this.setFoucus('trantype');
      if (this.activeId == 'trantype') this.setFoucus('group');
      if (this.activeId == 'remarks') this.setFoucus('vouchercustcode');
      if (this.activeId == 'vouchercustcode') this.setFoucus('vouchercode');
      if (this.activeId == 'vouchercode') this.setFoucus('toamount');
      if (this.activeId == 'toamount') this.setFoucus('frmamount');
      if (this.activeId == 'frmamount') this.setFoucus('trantype');
      if (this.activeId == 'group') this.setFoucus('ledgerdaybook');
      if (this.activeId == 'ledgerdaybook') this.setFoucus('vouchertype');

    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
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


  openVoucherDetail(voucherId, vouhercode) {
    console.log('vouher id', voucherId);
    this.common.params = {

      vchid: voucherId,
      vchcode: vouhercode
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

  openinvoicemodel(voucherId,code,type) {
    if(type.toLowerCase().includes('voucher')){
      if(type.toLowerCase().includes('trip')){
        this.openConsignmentVoucherEdit(voucherId);
      }else{
        this.openVoucherDetail(voucherId,code);
      }
    }else{
    this.common.params = {
      invoiceid: voucherId,
      delete: 0,
      indexlg: 0
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
}

  openConsignmentVoucherEdit(voucherData) {
    const params = {
      vehId: 0,
      voucherid: voucherData.y_voucherid,
      isdate: 0
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        console.log('trip expence', res);
        this.common.loading--;
        this.getVoucherSummary(res['data'][0], voucherData);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }
  getVoucherSummary(tripVoucher, voucherData) {
    let promises = [];
    promises.push(this.getPendingOnEditTrips(tripVoucher.y_vehicle_id));
    promises.push(this.getVocherEditTime(tripVoucher.y_voucher_id));
    promises.push(this.getPendingTripsEditTime(tripVoucher.y_id, tripVoucher.y_vehicle_id));
    if (voucherData.y_vouchertype_id == -151) {
      promises.push(this.getTripsExpDriver(tripVoucher.y_id));
    }
    promises.push(this.getTripExpenseVoucherTripsData(tripVoucher));

    Promise.all(promises).then(result => {
      this.showVoucherSummary(this.tripExpenseVoucherTrips, tripVoucher, voucherData);
    }).catch(err => {
      console.log('Error:', err);
      this.common.showError('There is some technical error occured. Please Try Again!');
    });

  }
  getTripExpenseVoucherTripsData(tripVoucher) {
    return new Promise((resolve, reject) => {
      const params = {
        voucherId: tripVoucher.y_voucher_id,
        voucherDetail: tripVoucher
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripExpenseVoucherTripsData', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpenseVoucherTrips = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }

  getPendingOnEditTrips(vehicleid) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vehicleid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTrips', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.TripEditData = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }
  getVocherEditTime(VoucherID) {
    return new Promise((resolve, reject) => {
      const params = {
        vchId: VoucherID
      };
      this.common.loading++;
      this.api.post('Voucher/getVoucherDetail', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.VoucherEditTime = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject(err);
        });
    })
  }

  getPendingTripsEditTime(voucherid, vhicleId) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vhicleId,
        vchrid: voucherid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTripsEdit', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.pendingDataEditTme = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }

  getTripsExpDriver(tripvoucherid) {
    return new Promise((resolve, reject) => {
      const params = {
        tripVchrId: tripvoucherid
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripsExpDriver', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpDriver = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject(err);
        });
    })
  }

  showVoucherSummary(tripDetails, tripVoucher, voucherData) {
    let vehId = tripVoucher.y_vehicle_id;
    let tripEditData = this.TripEditData;
    let tripPendingDataSelected = this.pendingDataEditTme;
    let VoucherData = this.VoucherEditTime;
    let typeFlag = 1;
    let permanentDelete = 0;


    // if (voucherData.y_vouchertype_id == -151) {
    //   let tripExpDriver = this.tripExpDriver;
    //   this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };


    //   console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
    //   const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    //   activeModal.result.then(data => {
    //     // console.log('Data: ', data);
    //     if (data.response) {
    //       //this.addLedger(data.ledger);
    //    // this.getDayBook();

    //     }
    //     // this.selectedVehicle.id =0
    //   });
    // } else
    {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(TripdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          //this.addLedger(data.ledger);
          // this.getDayBook();
        }
      });
    }
  }
}

