import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { LedgerComponent} from '../ledger/ledger.component';

@Component({
  selector: 'taxdetail',
  templateUrl: './taxdetail.component.html',
  styleUrls: ['./taxdetail.component.scss']
})
export class TaxdetailComponent implements OnInit {
  showConfirm = false;
  amount=0;
  sizeIndex=0;
  taxdetails = [{
    taxledger: {
      name: '',
      id: '',
    },
    taxrate: 0,
    taxamount: 0,
    totalamount:0

  }];
  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };

  constructor(public api: ApiService,
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal) {
    this.setFoucus('taxledger-0');
    this.getPurchaseLedgers();
    console.log('tax detail ',this.common.params,this.common.params.taxDetail.length);
    this.amount = this.common.params.amount;
    if(this.common.params.sizelandex) {
      this.sizeIndex = this.common.params.sizelandex;
    }
    if(this.common.params && this.common.params.taxDetail.length){
      this.taxdetails = this.common.params.taxDetail;
      this.common.params = null;
    }
console.log('size index',this.sizeIndex);
    this.common.handleModalSize('class', 'modal-lg', '1250','px',this.sizeIndex);

  }

  allowBackspace = true;


  ngOnInit() {
  }

  dismiss(response) {
    console.log('response>>>>>>>>>',response,this.taxdetails);
    if(response){
    this.activeModal.close({ response: response, taxDetails: this.taxdetails });
    }else{
    console.log('response//////////',this.taxdetails);
    this.taxdetails=[ {taxledger: {
      name: '',
      id: '',
    },
    taxrate: 0,
    taxamount: 0,
    totalamount:0
    }];
    console.log('response//////////return',this.taxdetails);

    this.activeModal.close({ response: response, taxDetails: this.taxdetails });
    }
    // return this.taxdetails;
    // console.log(this.taxdetails);

  }

  getPurchaseLedgers() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetLedgerWithRate', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.autoSuggestion.data = res['data'];
        this.autoSuggestion.targetId = 'taxledger-0';
        this.autoSuggestion.display = 'name';
        // this.suggestions.purchaseLedgers = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  onSelected(selectedData, type, display, index) {
    this.taxdetails[index][type].name = selectedData[display];
    this.taxdetails[index][type].id = selectedData.id;
    this.taxdetails[index][type].taxrate = selectedData.per_rate;
    console.log('tax detail User: ', selectedData, type, display, index);
  }

  addAmountDetails() {
    this.taxdetails.push({
      taxledger: {
        name: '',
        id: '',
      },
      taxrate: 0,
      taxamount: 0,
      totalamount:0
    });

    const activeId = document.activeElement.id;
    let index = parseInt(activeId.split('-')[1]) + 1;
    console.log(index);
    // activeId.includes('taxdetailbutton');
    this.setFoucus('taxledger-' + index);
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);
    if ((event.altKey && key === 'c') && (activeId.includes('taxledger'))) {
      // console.log('alt + C pressed');
      this.openledger();
    }
    if (activeId.includes('taxledger')) {
    
      this.autoSuggestion.targetId = activeId;
      console.log('-=-----------------------------');
    }

    if (this.showConfirm) {
      if (key == 'enter') {
        console.log(' show taxdetails:', this.taxdetails);
        this.dismiss(true);
        this.common.showToast('Your Value Has been saved!');
      } else if (key == 'y') {
        this.addAmountDetails();
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      // console.log('active', activeId);
      if (activeId.includes('taxledger') || activeId.includes('taxrate') || activeId.includes('taxamount')) {
        let index = activeId.split('-')[1];
        if (activeId.includes('taxledger')) this.setFoucus('taxrate-' + index);
        if (activeId.includes('taxrate')) this.setFoucus('taxamount-' + index);
        if (activeId.includes('taxamount')){
         console.log('total length of text detail',this.taxdetails.length,'actv id',activeId);
         let totallenth =this.taxdetails.length;
         if(totallenth == ( parseInt(index)+1)){
          this.showConfirm = true;
         }else{
          this.setFoucus('taxledger-' + (parseInt(index)+1));
         }
        }
        

      }


    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();

      if (activeId.includes('taxledger') || activeId.includes('taxrate') || activeId.includes('taxamount')) {
        let index = parseInt(activeId.split('-')[1]);
        if (index != 0) this.setFoucus('taxamount-' + (index - 1));
        if (activeId.includes('taxrate')) this.setFoucus('taxledger-' + index);
        if (activeId.includes('taxamount')) this.setFoucus('taxrate-' + index);

      }
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
    }

  }

  // this.autoSuggestion.data = this.suggestions.invoiceTypes;

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
      if (id.includes('taxledger')) {
        this.autoSuggestion.targetId = id;
        console.log('==================================');
        console.log('Target Id:', this.autoSuggestion.targetId);
        console.log('Target Id:', this.autoSuggestion.data);
        console.log('Target Id:', this.autoSuggestion.display);


      }
    }, 100);
  }

  openledger(ledgers?) {
    console.log('ledger123', ledgers);
   // this.common.handleModalSize('class', 'modal-lg', '1250','px',2);
    
    if (ledgers) {
      this.common.params ={
      ledger:ledgers,
      sizeledger:this.sizeIndex+1
    } ;
  }else {
    this.common.params ={
      sizeledger:this.sizeIndex+1
    };
  }
    const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        // console.log('ledger data',data.ledger);
        this.addLedger(data.ledger);
      }
    });
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
      primarygroupid: ledger.account.primarygroup_id,
      account_id: ledger.account.id,
      accDetails: ledger.accDetails,
      x_id: 0,
      branchname: ledger.branchname,
      branchcode: ledger.branchcode,
      accnumber: ledger.accnumber,
      creditdays: ledger.creditdays,
      openingbalance: ledger.openingbalance,
      isdr: ledger.openingisdr,
      approved: ledger.approved,
      deleteview: ledger.deleteview,
      delete: ledger.delete,
      costcenter: ledger.costcenter,
      taxtype:ledger.taxtype,
      taxsubtype:ledger.taxsubtype
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        this.getPurchaseLedgers();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  modelCondition(){
    this.showConfirm = false;
    event.preventDefault();
    return;
   }

  onSelect(suggestion, activeId) {
    console.log('current activeId: ', activeId,suggestion);
    const index = parseInt(activeId.split('-')[1]);

    this.taxdetails[index].taxledger.name = suggestion.name;
    this.taxdetails[index].taxledger.id = suggestion.id;
    this.taxdetails[index].taxrate = (suggestion.per_rate == null) ? 0 : suggestion.per_rate;
    this.taxdetails[index].taxamount = parseFloat(((this.taxdetails[index].taxrate  * this.amount)/100).toFixed(2));

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
  }

  calculateTotal() {
    let total = 0;
    this.taxdetails.map(taxdetail => {
      total += parseFloat((taxdetail.taxamount).toString());
      //console.log('taxdetail Amount: ',  taxdetail.taxamount,total);

      this.taxdetails[0].totalamount=  parseFloat(total.toString());
    });
    return  parseFloat(total.toString());
  }
}
