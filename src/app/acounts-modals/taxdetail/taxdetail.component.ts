import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'taxdetail',
  templateUrl: './taxdetail.component.html',
  styleUrls: ['./taxdetail.component.scss']
})
export class TaxdetailComponent implements OnInit {
  showConfirm = false;
  taxdetails = [{
    taxledger: {
      name: '',
      id: '',
    },
    taxrate: '',
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
    public common: CommonService) {
    this.setFoucus('taxledger-0');
    this.getPurchaseLedgers();
    if(this.common.params && this.common.params.length){
      this.taxdetails = this.common.params;
      this.common.params = null;
    }
  }

  allowBackspace = true;


  ngOnInit() {
  }

  dismiss(response) {
    console.log(this.taxdetails);
    this.activeModal.close({ response: response, taxDetails: this.taxdetails });
    // return this.taxdetails;
    // console.log(this.taxdetails);

  }

  getPurchaseLedgers() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
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
    console.log('tax detail User: ', selectedData, type, display, index);
  }

  addAmountDetails() {
    this.taxdetails.push({
      taxledger: {
        name: '',
        id: '',
      },
      taxrate: '',
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
        if (activeId.includes('taxamount')) this.showConfirm = true;

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

  
  modelCondition(){
    this.showConfirm = false;
    event.preventDefault();
    return;
   }

  onSelect(suggestion, activeId) {
    console.log('current activeId: ', activeId);
    const index = parseInt(activeId.split('-')[1]);

    this.taxdetails[index].taxledger.name = suggestion.name;
    this.taxdetails[index].taxledger.id = suggestion.id;

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
  }

  calculateTotal() {
    let total = 0;
    this.taxdetails.map(taxdetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
      total += taxdetail.taxamount;
      this.taxdetails[0].totalamount=total;
    });
    return total;
  }
}
