import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';


@Component({
  selector: 'ledgermapping',
  templateUrl: './ledgermapping.component.html',
  styleUrls: ['./ledgermapping.component.scss']
})
export class LedgermappingComponent implements OnInit {
  secondaryData = [];
  selectedName = '';
  ledgerMapping = {
    ledger: {
      name: 'All',
      id: 0
    },
    group: {
      name: 'All',
      id: 0
    },
  };
  ledgerMappingData = [];
  ledgerList = [];
  activeId = 'secondaryname';
  selectedRow = -1;
  allowBackspace = true;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getSecondaryData();
    this.getLedgerList();
    this.setFoucus('secondaryname');
    this.common.currentPage = 'Ledger Mapping';
  }


  ngOnInit() {
  }

  refresh() {
    this.getSecondaryData();
    this.getLedgerList();
    this.setFoucus('secondaryname');
  }

  getSecondaryData() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetSecondaryAccount', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.secondaryData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getLedgerView() {
    //  console.log('Ledger:', this.ledgerMapping);
    let params = {
      ledger: this.ledgerMapping.ledger.id,
      group: this.ledgerMapping.group.id,
    };

    this.common.loading++;
    this.api.post('Accounts/getLedgerMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerMappingData = res['data'];
        this.setFoucus('secondaryname');
        if (this.ledgerMappingData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }
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
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','');

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
    this.ledgerMapping[type].name = selectedData[display];
    this.ledgerMapping[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('secondaryname')) {
        this.setFoucus('ledger');
      } else if (this.activeId.includes('ledger')) {
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'ledger') this.setFoucus('secondaryname');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.ledgerMappingData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.ledgerMappingData.length - 1) this.selectedRow++;

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


  openLedgerModal(ledger_id?) {
    let data = [];
    console.log('ledger123', ledger_id);
    if (ledger_id) {
      let params = {
        id: ledger_id
      }
      this.common.loading++;
      this.api.post('Accounts/EditLedgerdata', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('Res:', res['data']);
          data = res['data'];
          this.common.params = {
            ledgerdata: res['data'],
            deleted: 1,
        sizeledger:0
          }
          // this.common.params = { data, title: 'Edit Ledgers Data' };
          const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
          activeModal.result.then(data => {
            // console.log('Data: ', data);
            if (data.response) {
            if (data.ledger) {
              this.addLedger(data.ledger);
            }else{
             // this.GetLedger();
            }
            }
          });

        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
          this.common.showError();
        });
    }

   
  }

  addLedger(ledger) {
    console.log('ledgerdata', ledger);
    // const params ='';
    const params = {
      name: ledger.name,
      alias_name: ledger.aliasname,
      code: ledger.code,
      foid: ledger.user.id,
      per_rate: ledger.perrate,
      primarygroupid: ledger.undergroup.primarygroup_id,
      account_id: ledger.undergroup.id,
      accDetails: ledger.accDetails,
      branchname: ledger.branchname,
      branchcode: ledger.branchcode,
      accnumber: ledger.accnumber,
      creditdays: ledger.creditdays,
      openingbalance: ledger.openingbalance,
      isdr: ledger.openingisdr,
      approved: ledger.approved,
      deleteview: ledger.deleteview,
      delete: ledger.delete,
      x_id: ledger.id ? ledger.id : 0,
      bankname: ledger.bankname,
      costcenter: ledger.costcenter,
      taxtype:ledger.taxtype,
      taxsubtype:ledger.taxsubtype
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
       // this.GetLedger();
        if (res['data'][0].y_errormsg) {
          this.common.showToast(res['data'][0].y_errormsg);
        } else {
          this.common.showToast('Ledger Has been saved!');
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
}
