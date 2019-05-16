import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss']
})
export class CostCentersComponent implements OnInit {
  showConfirm = false;
  Accounts = {
    name: '',
    xid: 0


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



    if (this.common.params) {
      this.Accounts = {
        name: this.common.params.name,
        xid: this.common.params.id

      }
      console.log('Accounts: ', this.Accounts);
    }

  }

  ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    if (response == false) {
      this.activeModal.close({ response: response });
    } else {
      this.addAccount(this.Accounts);
    }
  }

  addAccount(Accounts) {
    console.log('accountdata', Accounts);
    const params = {
      name: Accounts.name,
      foid: 123,
      x_id: Accounts.xid
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
          this.activeModal.close({ response: true });
        }
        else {
          this.common.showToast(result);
        }
        // this.GetAccount();
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







}