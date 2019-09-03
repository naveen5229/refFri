import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';


@Component({
  selector: 'fuelfiling',
  templateUrl: './fuelfiling.component.html',
  styleUrls: ['./fuelfiling.component.scss']
})
export class FuelfilingComponent implements OnInit {
  fuelFilings = [];
  ledger = [];
  debitLedgerdata = [];
  creditLedger = {
    name: '',
    id: 0
  };
  debitLedger = {
    name: '',
    id: 0
  };
  fuelstationid = 0;
  storeids = [];
  date = this.common.dateFormatternew(new Date()).split(' ')[0];
  custcode = '';
  total = null;
  narration = '';
  checkall = false;
  activeId = 'creditLedger';
  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    //  this.common.currentPage = 'Fuel Fillings';
   // this.getFuelFillings();

    if(this.common.params.fuelData){
      this.fuelFilings   =this.common.params.fuelData;
    }
    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.getcreditLedgers('credit');
    this.getdebitLedgers('debit');
    this.setFoucus('custcode');

  }

  ngOnInit() {
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
        this.ledger = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  onSelected(selectedData, type, display) {
    console.log('selected data', this.creditLedger);
    this.creditLedger.name = selectedData.y_ledger_name;
    this.creditLedger.id = selectedData.y_ledger_id;
    console.log('Accounts User: ', this.creditLedger);
  }
  onDebitSelected(selectedData, type, display) {
    this.debitLedger.name = selectedData.y_ledger_name;
    this.debitLedger.id = selectedData.y_ledger_id;
    console.log('Accounts11 User: ', this.debitLedger);
  }
  getcreditLedgers(transactionType) {
    //  this.showSuggestions = true;
    let voucherId = -7;
    let url = 'Suggestion/GetLedger?transactionType=' + transactionType + '&voucherId=' + voucherId + '&search=' + 'name';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.ledger = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
    //this.setFoucus('ref-code');
  }

  getdebitLedgers(transactionType) {
    //  this.showSuggestions = true;
    let voucherId = -7;
    let url = 'Suggestion/GetLedger?transactionType=' + transactionType + '&voucherId=' + voucherId + '&search=' + 'name';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.debitLedgerdata = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
    //this.setFoucus('ref-code');
  }

  getFuelFillings() {
    console.log('params model', this.common.params);
    this.fuelstationid = this.common.params.fuelstationid.id;
    const params = {
      vehId: this.common.params.vehId,
      lastFilling: this.common.params.lastFilling,
      currentFilling: this.common.params.currentFilling,
      fuelstationid: this.fuelstationid
    };
    this.common.loading++;
    this.api.post('Fuel/getFeulfillings', params)
      .subscribe(res => {
        console.log('fuel data', res);
        this.common.loading--;
        if(res['data']){
        this.fuelFilings = res['data'];
        }
        // this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  checkedAll() {
    console.log('true value', this.checkall);
    let selectedAll = '';
    let temp = 0;
    if (this.checkall) {
      this.fuelFilings.map(trip => trip.isChecked = true);
      this.fuelFilings.map(trip =>
        temp += parseFloat(trip.y_amount));
      this.total = temp;
      this.fuelFilings.map(trip =>
        this.storeids.push(trip.y_id));


    } else {
      this.fuelFilings.map(trip => trip.isChecked = false);
      this.total = null;
      this.storeids = [];
    }
    // for (var i = 0; i < this.trips.length; i++) {
    //   this.trips[i].selected = true;
    // }
  }
  changeTotal(checkvalue, id) {
    // this.fuelFilings.map(trip => trip.isChecked = true);
    console.log('check value',checkvalue,'this.total',this.total,'tesd',this.fuelFilings);
    let temp1=null;
    this.fuelFilings.map(trip =>{
      if(trip.isChecked){
      temp1 += parseFloat(trip.y_amount);
    }
  });

    this.total = parseFloat(temp1);
    this.storeids.push(id);

  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    if (key == 'enter') {
      //  this.allowBackspace = true;
      if (this.activeId.includes('custcode')) {
        this.setFoucus('date');
      } else if (this.activeId.includes('date')) {
        this.setFoucus('creditLedger');
      } else if (this.activeId == 'creditLedger') {
        this.setFoucus('debitLedger');
      } else if (this.activeId.includes('debitLedger')) {
        this.setFoucus('narration');
      } else if (this.activeId.includes('narration')) {
        this.setFoucus('total');
      } else if (this.activeId.includes('total')) {
        this.setFoucus('submit');
      }
    }

  }

  modelCondition() {
    // this.showConfirm = false;
    this.activeModal.close({ response: true });
    event.preventDefault();
    return;
  }
  dismiss(response) {

    if (this.accountService.selected.branch.id != 0) {
      // this.accountService.selected.branch
      this.addVoucher();
      // this.showConfirm = false;
      event.preventDefault();
      return;
    } else {
      alert('Please Select Branch');
    }
  }
  addVoucher() {
    let amountDetails = [];
    amountDetails.push({
      transactionType: 'credit',
      ledger: {
        name: this.creditLedger.name,
        id: this.creditLedger.id
      },
      amount: this.total,
      details: []
    });

    amountDetails.push({
      transactionType: 'debit',
      ledger: {
        name: this.debitLedger.name,
        id: this.debitLedger.id
      },
      amount: this.total,
      details: []
    });

    //const params ='';
    const fuelEntryData = {
      foid: 123,
      // vouchertypeid: voucher.voucher.id,
      customercode: this.custcode,
      remarks: this.narration,
      date: this.date,
      amountDetails: amountDetails,
      vouchertypeid: -171,
      y_code: '',
      xid: 0,
      delete: 0,
    };

    console.log('params 1 : ', fuelEntryData);
   // this.common.loading++;
    this.updatefuelfiling(fuelEntryData);

    // this.api.post('Voucher/InsertVoucher', params)
    //   .subscribe(res => {
    //     this.common.loading--;
    //     console.log('return vouher id: ', res['data']);
    //     if (res['success']) {

    //       if (res['data'][0].save_voucher_v1) {

    //         //  this.voucher = this.setVoucher();
    //         //  this.getVouchers();
    //         this.common.showToast('Your Code :' + res['data'].code);
    //         //   this.setFoucus('ref-code');

    //         this.updatefuelfiling(res['data'][0].save_voucher_v1);

    //       } else {
    //         let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
    //         this.common.showError(message);
    //       }
    //     }

    //   }, err => {
    //     this.common.loading--;
    //     console.log('Error: ', err);
    //     this.common.showError();
    //   });
  }

  updatefuelfiling(vchData) {

    console.log('total ids', this.storeids);

    const params = {
      voucherData: vchData,
      fuelids: this.storeids,
      fuestation: this.fuelstationid
    };
    this.common.loading++;
    this.api.post('FuelDetails/getUpdateFuelIds', params)
      .subscribe(res => {
        console.log('fuel data', res);
        this.common.loading--;
        // this.getHeads();
        this.activeModal.close({ response: true });
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
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
