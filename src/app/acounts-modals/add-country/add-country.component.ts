import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.scss']
})
export class AddCountryComponent  implements OnInit {
  showConfirm = false;
  suggestions: [{
    id: '',
    name: '',
  }];
  data = {
    city: '',
    code: '',
    id:-1
  };
  allowBackspace = true;
  // autoSuggestion = {
  //   data: [],
  //   targetId: 'state',
  //   display: 'name'
  // };
  citydata=[];
  activeId = 'city';
  suggestionIndex = -1;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public accountService: AccountService,
    public user: UserService,
    public api: ApiService) {
    //this.getStates();

    if (this.common.params) {
      this.data = {
        city: this.common.params.country_name,
        code:this.common.params.country_code,
        id:this.common.params.id
      }
      console.log('data: ', this.data);
    }
    this.common.handleModalSize('class', 'modal-lg', '1250');
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  dismiss(response) {
    console.log('data:', this.data);
    if(response){
      this.saveCountry();
    this.activeModal.close({ response: response });
    }else{
    this.activeModal.close({ response: response });
    }
  }

  // onSelected(selectedData, type, display) {
  //   this.data[type].name = selectedData[display];
  //   this.data[type].id = selectedData.id;
  //   console.log('State Data: ', this.data);
  // }
  



  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('event', event);

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('data show confirm:', this.data);
        this.dismiss(true);
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }


    if (key == 'enter') {
      this.allowBackspace = true;
       if (activeId.includes('city')) {
        this.setFoucus('code');
      } else if (activeId.includes('code')) {
        this.showConfirm = true;
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      if (activeId.includes('code')) {
        this.setFoucus('city');
      } else if (activeId.includes('city')) {
       // this.setFoucus('select-state');
      this.allowBackspace = false;

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

  saveCountry() {
    const params = this.data;
    this.common.loading++;

    this.api.post('Accounts/saveCountry', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.citydata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
 
}

