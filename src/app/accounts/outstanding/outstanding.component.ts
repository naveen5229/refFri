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
import { PdfService } from '../../services/pdf/pdf.service';
@Component({
  selector: 'out-standing-tree',
  template: `
  <div *ngIf="active">
    <div *ngFor="let d of data let i = index">
      <div style="cursor:pointer"  *ngIf="d.name"  class="row x-sub-stocktype" (click)="activeIndex = activeIndex !== i ? i : -1">
          <div class="col x-col" *ngIf="d.name">{{labels}} {{d.name}}</div>
          <div class="col x-col" *ngIf="d.name" >&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name">&nbsp;</div>
          <div class="col x-col" *ngIf="d.name" style="text-align:right;"> {{d.debit | number : '1.2-2'}} </div>
          <div class="col x-col" *ngIf="d.name" style="text-align:right;"> {{d.credit | number : '1.2-2'}} </div>
      </div>
      <out-standing-tree *ngIf="d.name" [data]="d.data" [action]="action" [isExpandAll]="isExpandAll"  [active]="activeIndex === i || isExpandAll ? true : false" [labels]="labels"></out-standing-tree>
      <div *ngIf="!d.name"  class="row x-warehouse" (dblclick)="(d.y_voucher_type_name.toLowerCase().includes('voucher'))  ? (d.y_voucher_type_name.toLowerCase().includes('trip')) ? action(d,'',d.y_voucher_type_name) :action(d.y_voucherid,d.y_code,d.y_voucher_type_name) : action(d.y_voucherid,'',d.y_voucher_type_name)" (click)="selectedRow = i" [ngClass]="{'highlight' : selectedRow == i }">
        <div class="col x-col">&nbsp;</div>
        <div class="col x-col">{{d.y_ledger_name}}</div>
        <div class="col x-col">{{d.y_voucher_code}}</div>
        <div class="col x-col">{{d.y_voucher_cust_code}}</div>
        <div class="col x-col">{{d.y_voucher_date | date:'dd-MMM-yy'}}</div>
        <div class="col x-col">{{d.y_voucher_type_name}}</div>
        <div class="col x-col">{{d.y_dramunt | number : '1.2-2'}}</div>
        <div class="col x-col">{{d.y_cramunt | number : '1.2-2'}}</div>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./outstanding.component.scss']
})
export class outStandingTreeComponent {
  @Input() data: any;
  @Input() active: boolean;
  @Input() labels: string;
  @Input() action: any;
  @Input() isExpandAll: boolean;
  activeIndex: boolean = false;
  selectedRow: number = -1;


}

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
  secondarygroup = [];
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
    trantype: 0,
    groupid: {
      name: 'All',
      id: 0
    },
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
  viewType = 'sub';
  TripEditData = [];
  VoucherEditTime = [];
  pendingDataEditTme = [];
  tripExpDriver = [];
  tripExpenseVoucherTrips = [];
  isExpandMainGroup: boolean = false;
  isExpandAll: boolean = false;
  isExpand: string = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public pdfService: PdfService,
    public csvService: CsvService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getLedgerList();
    this.setFoucus('ledger');
    this.getSecondaryGoup();
    this.common.currentPage = 'Outstanding Report';
    this.headingName = this.user._customer.name + '( ' + this.accountService.selected.branch.name + ' ) From :' + this.outStanding.startDate + ' To ' + this.outStanding.endDate;
  }

  activeGroup = [];

  ngOnInit() {
  }
  refresh() {
    this.getLedgerList();
    this.setFoucus('ledger');
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
      trantype: this.outStanding.trantype,
      groupid: this.outStanding.groupid.id,
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
  openinvoicemodel(voucherId, code, type) {
    if (type.toLowerCase().includes('voucher')) {
      if (type.toLowerCase().includes('trip')) {
        this.openConsignmentVoucherEdit(voucherId);
      } else {
        this.openVoucherDetail(voucherId, code);
      }
    } else {
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
  pdfFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = (res['data'][0]) ? res['data'][0].addressline + '\n' : '';
        let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1 + remainingstring3;
        let foname = (res['data'][0]) ? res['data'][0].foname : '';
        this.common.getPDFFromTableIdnew('balance-sheet', foname, cityaddress, '', '', 'Out Standing From :' + this.outStanding.startDate + ' To :' + this.outStanding.endDate);

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
    for (let i = 0; i < this.ledgerData.length; i++) {
      let ledgerRegister = this.ledgerData[i];
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
    //   this.voucherEntries.map(voucher => voucher.data = this.findChilds(voucher.data));
    //   console.log('voucherEntries', this.voucherEntries);
    //   this.voucherEntries = [];
    //   let allGroups = _.groupBy(this.ledgerData, 'y_path');
    //   console.log('allGroups',allGroups);

    //   allGroups.map((dataval,index) => {
    //  console.log('allkeys111',dataval);
    //     let subGroups = _.groupBy(dataval, 'y_path');
    //   let allKeys = Object.keys(subGroups);
    //   allKeys.map((key, index) => {
    //     this.voucherEntries[index] = {
    //       name: key,
    //       amount: {
    //         debit: 0,
    //         credit: 0
    //       },
    //       vouchers: allGroups[key]
    //     };
    //     allGroups[key].map(data => {
    //       this.voucherEntries[index].amount.debit += parseFloat(data.y_dramunt);
    //       this.voucherEntries[index].amount.credit += parseFloat(data.y_cramunt);
    //     });
    //   });
    // });
    //   this.showAllGroups();
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
      if (this.activeId.includes('ledger')) {
        this.setFoucus('startDate');
      } else if (this.activeId.includes('startDate')) {
        this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('endDate');
      } else if (this.activeId.includes('endDate')) {
        this.setFoucus('groupid');
      } else if (this.activeId.includes('endDate')) {
        this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
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

  handleGroupView(index) {
    if (this.activeGroup.indexOf(index) !== -1) {
      this.activeGroup.splice(this.activeGroup.indexOf(index), 1);
      return;
    }
    this.activeGroup.push(index);
  }

  showAllGroups() {
    this.activeGroup = this.voucherEntries.map((voucherEntry, index) => { return index; });

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

  generateCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({ liability: " Liability", liabilityAmount: 'Amount' }));

    this.voucherEntries.forEach(liability => {
      liabilitiesJson.push({ liability: '(MG)' + liability.name, liabilityAmount: liability.amount });
      liability.subGroups.forEach(subGroup => {
        liabilitiesJson.push({ liability: '(SG)' + subGroup.name, liabilityAmount: subGroup.total });
        subGroup.balanceSheets.forEach(balanceSheet => {
          liabilitiesJson.push({ liability: '(L)' + balanceSheet.y_ledger_name, liabilityAmount: balanceSheet.y_amount });
        });
      });
    });


    let mergedArray = [];

    for (let i = 0; i < liabilitiesJson.length; i++) {
      if (liabilitiesJson[i] && i < liabilitiesJson.length - 1) {
        mergedArray.push(Object.assign({}, liabilitiesJson[i], { asset: '', assetAmount: '' }));
      }
    }
    mergedArray.push(Object.assign({}, liabilitiesJson[liabilitiesJson.length - 1]))
    mergedArray.push(Object.assign({}, { "": 'MG = Main Group ,SG = Sub Group, L = Ledger' }))

    this.csvService.jsonToExcel(mergedArray);
    console.log('Merged:', mergedArray);
  }

  csvFunction() {
    let jrxJson = [];
    jrxJson.push(Object.assign({
      particular: "Particular",
      ledgerName: "Ledger Name",
      voucherCode: "Voucher Code",
      voucherCustCode: "Voucher Cust Code",
      voucherDate: "Voucher Date",
      voucherType: "Voucher Type",
      drAmount: "Dr Amount",
      crAmount: "Cr Amount"
    }));
    this.voucherEntries.forEach(voucher => {
      jrxJson.push({
        particular: voucher.name,
        ledgerName: "",
        voucherCode: "",
        voucherCustCode: "",
        voucherDate: "",
        voucherType: "",
        drAmount: voucher.debit,
        crAmount: voucher.credit
      });
      jrxJson.push(...this.generateCSVData(voucher.data, '  '));
    });
    this.csvService.jsonToExcel(jrxJson);
  }

  generateCSVData(vouchers, str) {
    let json = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      if (voucher.name) {
        json.push({
          particular: str + voucher.name,
          ledgerName: "",
          voucherCode: "",
          voucherCustCode: "",
          voucherDate: "",
          voucherType: "",
          drAmount: voucher.debit,
          crAmount: voucher.credit
        });
        json.push(...this.generateCSVData(voucher.data, str + '  '));
      } else {
        json.push({
          particular: "",
          ledgerName: (voucher.y_ledger_name) ? voucher.y_ledger_name : '',
          voucherCode: (voucher.y_code) ? voucher.y_code : '',
          voucherCustCode: (voucher.y_voucher_cust_code) ? voucher.y_voucher_cust_code : '',
          voucherDate: (voucher.y_voucher_date) ? voucher.y_voucher_date : '',
          voucherType: (voucher.y_voucher_type_name) ? voucher.y_voucher_type_name : '',
          drAmount: voucher.y_dramunt,
          crAmount: voucher.y_cramunt
        });
      }
    }
    return json;
  }

  printX() {
    console.log(this.isExpand);
  }
}
