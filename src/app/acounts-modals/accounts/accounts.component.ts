import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  showConfirm = false;
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
    display: 'name'
  };
  activeId ='account';
  suggestionIndex = -1;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
   


    if (this.common.params) {
      this.Accounts = {
        name: this.common.params.name,

        account: {
          name: this.common.params.parent_name,
          id: this.common.params.parent_id,
          primarygroup_id: this.common.params.primarygroup_id
        }
      }
      console.log('Accounts: ', this.Accounts);
    }
    this.getAccountData();
  }

  ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    this.activeModal.close({ response: response, Accounts: this.Accounts, });
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



  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('event', event);

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Accounts show confirm:', this.Accounts);
        this.dismiss(true);
        this.common.showToast('Your Value Has been saved!');
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
      search: 123
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
  }


}
