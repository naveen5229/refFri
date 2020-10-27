import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AddCityComponent } from '../../acounts-modals/add-city/add-city.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { from } from 'rxjs';
@Component({
  selector: 'city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  data = [];
  statedata=[];
  showConfirm = false;
  autoSuggestion = {
    data: [],
    targetId: 'state',
    display: 'name'
  };

  getstatedata = {
    state: {
      name: 'Rajasthan',
      id: 29,

    }
  };
  activeId = 'state';
  suggestionIndex = -1;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getpageData();
    this.getStates();
    this.common.currentPage = 'city';
    this.common.refresh = this.refresh.bind(this);
    this.setFoucus('submit');

  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getpageData();
  }
  getStates() {
    const params = {
      foid: 123
    };
    this.common.loading++;

    this.api.post('Suggestion/GetState', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.autoSuggestion.data = res['data'];
        this.statedata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getpageData() {
    let params = {
      foid: 123,
      stateid:this.getstatedata.state.id
    };

    this.common.loading++;
    this.api.post('Accounts/GetCity', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        console.log("after api data:", this.data);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openModal(city?) {

    if (city) {
      console.log('city', city);
      this.common.params = city;
      const activeModal = this.modalService.open(AddCityComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
         // this.updateCity(data.city, city.id);
        this.getpageData();
        return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(AddCityComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
        //  this.addCity(data.city);
        this.getpageData();
        return;
        }
      });
    }
  }


  addCity(city) {
    console.log('city', city);
    const params = {
      cityname: city.city,
      stateid: city.state.id,
      pincode: city.pincode
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertCity', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.common.showToast(res['msg']);


        this.getpageData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  updateCity(city, rowid) {
    console.log('updated data', city);
    const params = {
      cityname: city.city,
      stateid: city.state.id,
      pincode: city.pincode,
      id: rowid
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertCity', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        if (res['msg']) {
          this.common.showToast("Update SuccessFull");
        }

        this.getpageData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  deleteCity(city) {
    console.log('city data', city);
    const params = {
      id: city.id
    };
    console.log('params: ', params);

    if (city) {
      console.log('city', city);
      this.common.params = {
        title: 'Delete City ',
        description: 'Are Sure to Delete ' +`<b>&nbsp;`+ city.city_name+`<b>`+ ' City',
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Accounts/DeleteCity', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              this.getpageData();
              this.common.showToast(" Delete Record");
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError();
            });
        }
      });
    }
  }

  selectSuggestion(suggestion, id?) {
    console.log('Suggestion on select: ', suggestion);
    this.getstatedata.state.name = suggestion.name;
    this.getstatedata.state.id = suggestion.id;

  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    this.getstatedata.state.name = suggestion.name;
    this.getstatedata.state.id = suggestion.id;
  }
  onSelected(selectedData, type, display) {
    this.getstatedata.state.name = selectedData[display];
    this.getstatedata.state.id = selectedData.id;
  //  console.log('Selected Data: ', selectedData, type, display);
    console.log('order User: ', this.getstatedata);
    this.setFoucus('submit');
  }

  
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }
}

