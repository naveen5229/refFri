import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss']
})
export class CostCentersComponent implements OnInit {
  showConfirm = false;
  Accounts = {
    parentName: 'is Primary',
    parentId: 0,
    xid: 0,
    name: '',
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
        parentName: this.common.params.parente_name,
        parentId: this.common.params.id,
        xid: this.common.params.id,
        name: this.common.params.name,

      }
      console.log('Accounts 11: ', this.Accounts);
    }
    this.common.handleModalSize('class', 'modal-lg', '1250');
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    this.activeModal.close({ response: response, costCenter: this.Accounts });
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
      if (activeId.includes('account')) {
        this.setFoucus('name');
      } else if (activeId.includes('name')) {
        this.showConfirm = true;
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      if (activeId.includes('name')) {
        this.setFoucus('account');
      } else if (activeId.includes('account')) {
        this.setFoucus('user');
      }
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


  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    this.Accounts.parentName = suggestion.name;
    this.Accounts.parentId = suggestion.id;
    // this.Accounts.account.primarygroup_id =suggestion.primarygroup_id;
  }





}