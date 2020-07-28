import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  showConfirm = false;
  foid=1;
  Accounts = {
    name: '',

    account: {
      name: '',
      id: -1,
      primarygroup_id: ''
    }

  };
  allowBackspace = true;
  
  autoSuggestion = {
    data: [],
    targetId: 'account',
    name: 'y_name'
  };
  activeId ='account';
  suggestionIndex = -1;
  pagename='Add Secondary Account';
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService,
    public accountService: AccountService) {
   
console.log('accounts get data',this.common.params);

    if (this.common.params) {
     this.foid= this.common.params.name;
      this.Accounts = {
        name: this.common.params.name,

        account: {
          name: this.common.params.parent_name,
          id: this.common.params.parent_id,
          primarygroup_id: this.common.params.primarygroup_id
        }
      }
      console.log('Accounts: ', this.Accounts);
      this.pagename='Edit Secondary Account';
    }
    this.getAccountData();
    
  }

  ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Accounts);
   
    this.activeModal.close({ response: response, Accounts: this.Accounts, });
 
}

modalCondition(res){
  this.activeModal.close({ response: false, Accounts: this.Accounts, });

}

  onSelected(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.y_id;
    console.log('Accounts User: ', this.Accounts);
  }
  onParent(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.y_id;
    this.Accounts[type].primarygroup_id = selectedData.y_parent_id;
    console.log('Accounts Parent: ', this.Accounts,selectedData);
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
      if (activeId.includes('user')) {
        this.setFoucus('account');
      } else if (activeId.includes('account')) {
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


  getAccountData() {
    let params = {
      search: 123,
      conditionid:1
    };

    this.common.loading++;
    this.api.post('Suggestion/getAllUnderGroupData', params)
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
  selectSuggestion(suggestion, id?) {
    console.log('Suggestion on select: ', suggestion);
      this.Accounts.account.name = suggestion.name;
      this.Accounts.account.id = suggestion.id;
  }

  onSelect(suggestion, activeId){
    console.log('Suggestion: ', suggestion);
      this.Accounts.account.name = suggestion.name;
      this.Accounts.account.id = suggestion.id;
      this.Accounts.account.primarygroup_id =suggestion.primarygroup_id;
    console.log('Suggestion selcted: ', this.Accounts.account);

  }


}
