import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent  implements OnInit {
  showConfirm = false;
  Accounts = {
  };

  allowBackspace = true;

  autoSuggestion = {
    data: [],
    targetId: 'account',
    display: 'name'
  };
  activeId = 'account';
  suggestionIndex = -1;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.getCostCenter();
    if (this.common.params) {
      this.Accounts = {
        isamount:this.common.params.isamount,
        remarks:this.common.params.remarks,
        vouchercustcode:this.common.params.vouchercustcode,
        vouchercode:this.common.params.vouchercode,
        frmamount:this.common.params.frmamount,
        toamount:this.common.params.toamount 
      }
      console.log('Accounts 11: ', this.Accounts);
    }
    this.common.handleModalSize('class', 'modal-lg', '750');
  }

  ngOnInit() {
  }

  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    this.activeModal.close({ response: response, ledger: this.Accounts });
  }

  getCostCenter() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Accounts/GetCostCenter', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.autoSuggestion.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('event', event);

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Accounts show confirm:', this.Accounts);
        this.dismiss(true);
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }


    if (key == 'enter') {
      this.allowBackspace = true;
      if (activeId.includes('frmamount')) {
        this.setFoucus('toamount');
      } else if (activeId.includes('toamount')) {
        this.setFoucus('vouchercode');
      } else if (activeId.includes('vouchercode')) {
        this.setFoucus('vouchercustcode');
      } else if (activeId.includes('vouchercustcode')) {
        this.setFoucus('remarks');
      } else if (activeId.includes('remarks')) {
        this.setFoucus('trantype');
      } else if (activeId.includes('trantype')) {
        this.showConfirm = true;
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      if (activeId == 'trantype') this.setFoucus('group');
      if (activeId == 'remarks') this.setFoucus('vouchercustcode');
      if (activeId == 'vouchercustcode') this.setFoucus('vouchercode');
      if (activeId == 'vouchercode') this.setFoucus('toamount');
      if (activeId == 'toamount') this.setFoucus('frmamount');
      if (activeId == 'frmamount') this.setFoucus('trantype');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
    }

  }


  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }


 





}