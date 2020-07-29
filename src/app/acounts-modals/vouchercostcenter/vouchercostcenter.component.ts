import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';
import { CostCentersComponent } from '../cost-centers/cost-centers.component';


@Component({
  selector: 'vouchercostcenter',
  templateUrl: './vouchercostcenter.component.html',
  styleUrls: ['./vouchercostcenter.component.scss']
})
export class VouchercostcenterComponent implements OnInit {

  ledgers = {
    all: [],
    suggestions: []
  };
  showConfirm = false;

  showSuggestions = false;
  // ledgers = [];
  lastActiveId = '';
  allowBackspace = true;

  activeLedgerIndex = -1;
  // New variables
  mainAmount = 0;

  amountDetails = [];

  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal,
    public accountService: AccountService,
    private activeModal: NgbActiveModal) {
    console.log('Params: ', this.common.params);
    this.mainAmount = this.common.params.amount;
    if (this.common.params.details.length) {
      this.amountDetails = JSON.parse(JSON.stringify(this.common.params.details));
    } else {
      this.addAmountDetails(this.mainAmount);
    }
    this.getLedgers();
    console.log('amountDetails:', this.amountDetails);

    setTimeout(() => {
      this.setFoucus('cost-ledger-0');
      console.log('first active id', document.activeElement.id);

      console.log('first active id', this.lastActiveId);
    }, 1000);

    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);
  }

  ngOnInit() {

  }

  getLedgers() {
    let foid = 123;
    this.common.loading++;
    this.api.post('Accounts/GetCostCenter', { foid })
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgers.all = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }


  addAmountDetails(amount = 0) {
    this.amountDetails.push({
      ledger: {
        name: '',
        id: 0
      },
      amount: amount
    });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        this.showConfirm = false;
        event.preventDefault();
        this.dismiss(true);
      }
      return;
    }
    if (event.altKey && key === 'c') {
      // console.log('alt + C pressed');
      console.log('--------------------ALT+C-----------------:Cost Center');
      this.openCostCenter();
    }

    if (key == 'enter') {
      if (document.activeElement.id.includes('amount-')) {
        this.handleAmountEnter(document.activeElement.id.split('-')[2]);
      } else if (activeId.includes('cost-ledger-')) {
        let index = activeId.split('-')[2];
        if (this.activeLedgerIndex > this.ledgers.suggestions.length - 1) {
          this.activeLedgerIndex = 0;
        }
        console.log('Test: ', index, this.ledgers, this.ledgers.suggestions[0]);
        this.selectLedger(this.ledgers.suggestions[this.activeLedgerIndex !== -1 ? this.activeLedgerIndex : 0], index);
        this.setFoucus('cost-amount-' + index);
        //this.setFoucus('ledger-container');
        this.activeLedgerIndex = -1;
      }
      this.allowBackspace = true;
    } else if (key == 'backspace') {
      // console.log('Selected: ', window.getSelection().toString(), this.allowBackspace);
      if (activeId == 'cost-ledger-0' || !this.allowBackspace) return;
      event.preventDefault();
      let index = this.getElementsIDs().indexOf(document.activeElement.id);
      this.setFoucus(this.getElementsIDs()[index - 1]);
    } else if (key == 'escape') {
      this.allowBackspace = true;
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
      if ((key.includes('arrowup') || key.includes('arrowdown')) && activeId.includes('ledger-')) {
        this.handleArrowUpDown(key, activeId);
        event.preventDefault();
      }
      //console.log('helo',document.activeElement.id);
    } else if (activeId.includes('ledger-')) {
      let index = activeId.split('-')[2];
    }
  }

  handleAmountEnter(index) {
    index = parseInt(index);
    let total = 0;

    this.amountDetails.map(amountDetail => total += amountDetail.amount);
    console.log('Min:', total, this.mainAmount);
    if (total == this.mainAmount && index == this.amountDetails.length - 1) {
      this.amountDetails.splice(index + 1, this.amountDetails.length);
      console.log('Close Modal::::::::::::::::::::::');
      this.dismiss(true);
    } else if (index == this.amountDetails.length - 1 && total < this.mainAmount) {
      this.addAmountDetails(this.mainAmount - total);
      this.setFoucus('cost-ledger-' + (parseInt(index) + 1));
    } else if (total > this.mainAmount) {
      let xTotal = 0;
      for (let i = 0; i <= index; i++) {
        xTotal += this.amountDetails[i].amount;
      }
      if (xTotal == this.mainAmount) {
        this.amountDetails.splice(index + 1, this.amountDetails.length);
      } else if (index < this.amountDetails.length - 1) {
        this.setFoucus('cost-ledger-' + (parseInt(index) + 1));
      } else {
        console.log('Amount Large');
      }
    } else if (index < this.amountDetails.length - 1) {
      this.setFoucus('cost-ledger-' + (parseInt(index) + 1));
    } else {
      alert('Entries Ammount Error:');
    }
  }

  dismiss(response) {
    this.activeModal.close({ response: response, amountDetails: this.amountDetails });
  }



  setFoucus(id, isSetLastActive = true) {
    console.log('id set focus', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      this.moveCursor(element, 0, element['value'].length);
      //  if (isSetLastActive) this.lastActiveId = id;
      console.log('last active id11: ', this.lastActiveId);
    }, 100);
  }

  getElementsIDs() {
    let elementIDs = [];
    this.amountDetails.map((amountDetail, index) => {
      elementIDs.push('cost-ledger-' + index);
      elementIDs.push('cost-amount-' + index);
    });
    return elementIDs;
  }

  moveCursor(ele, startIndex = 0, endIndex = 0) {
    if (ele.select)
      ele.select();
    // ele.setSelectionRange(startIndex, endIndex);
  }

  selectLedger(ledger, index?) {
    console.log('Last Active ID22:', this.lastActiveId, ledger, index);
    // if (!index && this.lastActiveId.includes('cost-ledger')) {
    //   index = this.lastActiveId.split('-')[1];
    // }
    if (!index && document.activeElement.id.includes('cost-ledger')) {
      index = this.lastActiveId.split('-')[2];
    }


    this.amountDetails[index].ledger.name = ledger.name;
    this.amountDetails[index].ledger.id = ledger.id;
  }

  handleArrowUpDown(key, activeId) {
    let index = parseInt(activeId.split('-')[2]);
    if (key == 'arrowdown') {
      if (this.activeLedgerIndex != this.ledgers.suggestions.length - 1) {
        this.activeLedgerIndex++;
      }
    } else {
      if (this.activeLedgerIndex != 0) {
        this.activeLedgerIndex--;
      }
    }

    // this.voucher.amountDetails[index].ledger.name = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_name;
    // this.voucher.amountDetails[index].ledger.id = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_id;
  }

  getActiveLedgerType(ledgers) {
    console.log('ActiveID:', document.activeElement.id);
    let activeId = document.activeElement.id;
    if (!activeId.includes('ledger-')) return [];
    let index = parseInt(activeId.split('-')[2]);
    let suggestions = ledgers.all;
    // console.log(document.getElementById(this.lastActiveId)['value']);
    if (document.getElementById(activeId) && document.getElementById(activeId)['value']) {
      let search = document.getElementById(activeId)['value'].toLowerCase();
      suggestions = ledgers.all.filter(ledger => ledger.name.toLowerCase().includes(search));
    }
    this.ledgers.suggestions = suggestions;
    return suggestions;

  }


  openCostCenter(ledger?) {
    console.log('ledger123', ledger);
    if (ledger) this.common.params = ledger;
    const activeModal = this.modalService.open(CostCentersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "CostcenterClass" });
    activeModal.result.then(data => {
      console.log('Data: ', data);
      if (data.response) {
        // console.log('ledger data',data.ledger);
        this.addCostCenter(data.costCenter);
      }
    });
  }


  addCostCenter(costCenter) {
    console.log('costCenter', costCenter);
    const params = {
      parentName: costCenter.parentName,
      parentid: costCenter.parentId,
      foid: 123,
      x_id: 0,
      name: costCenter.name,
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertCostCenter', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_costcenter;
        if (result == '') {
          this.common.showToast("Save Successfully");
          this.getLedgers();
        }
        else {
          this.common.showToast(result);
        }
        //  this.getLedgers();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

}
