import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-state',
  templateUrl: './add-state.component.html',
  styleUrls: ['./add-state.component.scss']
})
export class AddStateComponent implements OnInit {
  showConfirm = false;
  suggestions: [{
    id: '',
    name: '',
  }];
  data = {
    city: '',
    pincode: '',
    state: {
      name: '',
      id: 0,
    },
    id:0,
    gstcode:''

  };
  allowBackspace = true;
  // autoSuggestion = {
  //   data: [],
  //   targetId: 'state',
  //   display: 'name'
  // };
  citydata=[];
  activeId = 'state';
  suggestionIndex = -1;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public accountService: AccountService,
    public user: UserService,
    public api: ApiService) {
    this.getStates();
      console.log('this.common.params',this.common.params);
    if (this.common.params) {
      this.data = {
        city: this.common.params.province_name,
        id: this.common.params.id,
        pincode:this.common.params.province_code,
        state: {
          name: this.common.params.country_name ? this.common.params.country_name : '',
          id: this.common.params.country_id,
        },
        gstcode:this.common.params.gst_state_code
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
      this.activeModal.close({ response: response});
      this.addCity(this.data);
    }else{
    this.activeModal.close({ response: response});
    }
  }

  // onSelected(selectedData, type, display) {
  //   this.data[type].name = selectedData[display];
  //   this.data[type].id = selectedData.id;
  //   console.log('State Data: ', this.data);
  // }
  
  addCity(city) {
    console.log('city', city);
    const params = {
      name: city.city,
      countryid: city.state.id,
      code: city.pincode,
      gstcode: city.gstcode,
      id: city.id
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertState', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.common.showToast(res['msg']);


       // this.getpageData();
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
        console.log('data show confirm:', this.data);
        this.dismiss(true);
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }


    if (key == 'enter') {
      this.allowBackspace = true;
      if (activeId.includes('user')) {
        this.setFoucus('state');
      } else if (activeId.includes('select-state')) {
        this.setFoucus('city');
      } else if (activeId.includes('city')) {
        this.setFoucus('pincode');
      } else if (activeId.includes('pincode')) {
        this.showConfirm = true;
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      if (activeId.includes('pincode')) {
        this.setFoucus('city');
      } else if (activeId.includes('city')) {
        this.setFoucus('select-state');
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

  getStates() {
    const params = {
      foid: 123,
    };
    this.common.loading++;

    this.api.post('Accounts/GetCountry', params)
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
  selectSuggestion(suggestion, id?) {
    console.log('Suggestion on select: ', suggestion);
    this.data.state.name = suggestion.name;
    this.data.state.id = suggestion.id;

  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    this.data.state.name = suggestion.name;
    this.data.state.id = suggestion.id;
  }

  onSelected(selectedData, type, display) {
    
    this.data.state.name = selectedData[display];
    this.data.state.id = selectedData.id;
  }
}

