import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'invoiceregister',
  templateUrl: './invoiceregister.component.html',
  styleUrls: ['./invoiceregister.component.scss']
})
export class InvoiceregisterComponent implements OnInit {
  
  vouchertypedata=[];
  branchdata=[];
  invoiceRegister = {
    endDate:this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    startDate:this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    custCode:'',
    code:'',
    ledger :{
        name:'',
        id:''
      },
      branch :{
        name:'',
        id:''
      },
      voucherType :{
        name:'',
        id:''
      }
    
    };
    invoiceRegisterData=[];
    ledgerList=[];
    activeId='branch';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
      this.getVoucherTypeList();
      this.getBranchList();
      this.getLedgerList();
      this.setFoucus('branch');
    }

  ngOnInit() {
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
  getInvoiceRegister() {
    console.log('Invoice Reister:', this.invoiceRegister);
    let params = {
      startdate: this.invoiceRegister.startDate,
      enddate: this.invoiceRegister.endDate,
      ledger: this.invoiceRegister.ledger.id,
      branch: this.invoiceRegister.branch.id,
      code: this.invoiceRegister.code,
      custCode: this.invoiceRegister.custCode,
      orderType: this.invoiceRegister.voucherType.id,
    };
    
    this.common.loading++;
    this.api.post('Accounts/getInvoiceRegister', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.invoiceRegisterData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.invoiceRegister[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log(this.invoiceRegister[date]);
    });
  }
  
  onSelected(selectedData, type, display) {
    this.invoiceRegister[type].name = selectedData[display];
    this.invoiceRegister[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
      if (this.activeId.includes('branch')) {
        this.setFoucus('voucherType');
      }else  if (this.activeId.includes('voucherType')) {
        this.setFoucus('ledger');
      }else  if (this.activeId.includes('ledger')) {
        this.setFoucus('startdate');
      }else  if (this.activeId.includes('startdate')) {
        this.setFoucus('enddate');
      }else  if (this.activeId.includes('enddate')) {
        this.setFoucus('code');
      }else  if (this.activeId.includes('custcode')) {
        this.setFoucus('submit');
      }else  if (this.activeId.includes('code')) {
        this.setFoucus('custcode');
      }
    }
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
