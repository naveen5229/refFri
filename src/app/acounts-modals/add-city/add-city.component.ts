import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
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

    }

  };
  allowBackspace = true;
  autoSuggestion = {
    data: [],
    targetId: 'state',
    display: 'name'
  };
  activeId = 'state';
  suggestionIndex = -1;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.getStates();

    if (this.common.params) {
      this.data = {
        city: this.common.params.city_name,
        pincode:this.common.params.pincode,
        state: {
          name: this.common.params.statename ? this.common.params.statename : '',
          id: this.common.params.province_id,
        }
      }
      console.log('data: ', this.data);
    }
  }

  ngOnInit() {
  }
  dismiss(response) {
    console.log('data:', this.data);
    this.activeModal.close({ response: response, city: this.data });
  }

  onSelected(selectedData, type, display) {
    this.data[type].name = selectedData[display];
    this.data[type].id = selectedData.id;
    console.log('State Data: ', this.data);
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
      } else if (activeId.includes('state')) {
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
        this.setFoucus('state');
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

    this.api.post('Suggestion/GetState', params)
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
    this.data.state.name = suggestion.name;
    this.data.state.id = suggestion.id;

  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    this.data.state.name = suggestion.name;
    this.data.state.id = suggestion.id;
  }

}
