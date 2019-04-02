import { Component, OnInit ,HostListener} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'ledgerview',
  templateUrl: './ledgerview.component.html',
  styleUrls: ['./ledgerview.component.scss']
})
export class LedgerviewComponent implements OnInit {
  vouchertypedata=[];
  branchdata=[];
  ledger = {
    endDate:this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    startDate:this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    ledger :{
        name:'All',
        id:0
      },
      branch :{
        name:'',
        id:''
      },
      voucherType :{
        name:'All',
        id:0
      }
    
    };
  ledgerData=[];
  ledgerList=[];
  activeId = 'voucherType';
  selectedRow = -1;

  @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event) {
      this.keyHandler(event);
    }


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
    this.getVoucherTypeList();
   // this.getBranchList();
    this.getLedgerList();
    this.setFoucus('voucherType');
    this.common.currentPage = 'Ledger View';
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
      ledger: this.ledger.ledger.id,
      branch: this.ledger.branch.id,
      vouchertype: this.ledger.voucherType.id,
    };
    
    this.common.loading++;
    this.api.post('Accounts/getLedgerView', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        if (this.ledgerData.length) {
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
      this.ledger[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log(this.ledger[date]);
    });
  }
  
  onSelected(selectedData, type, display) {
    this.ledger[type].name = selectedData[display];
    this.ledger[type].id = selectedData.id;
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
        this.setFoucus('submit');
      }
    }

    else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.ledgerData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.ledgerData.length - 1) this.selectedRow++;

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
