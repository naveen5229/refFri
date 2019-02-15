import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  Accounts = {
    name: '',
    aliasname: '',
    perrate: '',
    user: {
      name: '',
      id: ''
    },
    account: {
      name: '',
      id: '',
      primarygroup_id: ''
    },
    code: ''
  };
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {

    if (this.common.params) {
      this.Accounts = {
        name: this.common.params.name,
        aliasname: this.common.params.aliasname,
        perrate: this.common.params.perrate,
        user: {
          name: this.common.params.name,
          id: this.common.params.id
        },
        account: {
          name: this.common.params.name,
          id: this.common.params.id,
          primarygroup_id: this.common.params.primarygroup_id
        },
        code: ''
      }

      console.log('Accounts: ', this.Accounts);
    }
  }


  ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    this.activeModal.close({ response: response, ledger: this.Accounts });
  }

  onSelected(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.id;
    console.log('Accounts User: ', this.Accounts);
  }
  onParent(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.id;
    this.Accounts[type].primarygroup_id = selectedData.primarygroup_id;
    console.log('Accounts Parent: ', this.Accounts);
  }
}
