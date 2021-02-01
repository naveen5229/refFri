import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AddCountryComponent } from '../../acounts-modals/add-country/add-country.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { from } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
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
   // this.getStates();
    this.common.currentPage = 'Country';
    this.common.refresh = this.refresh.bind(this);
    this.setFoucus('submit');

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getpageData();
  }

  getpageData() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Accounts/GetCountry', params)
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
      const activeModal = this.modalService.open(AddCountryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
         // this.addCity(data.city);
         this.getpageData();
          return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(AddCountryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          //this.addCity(data.city);
          this.getpageData();
          return;
        }
      });
    }
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
