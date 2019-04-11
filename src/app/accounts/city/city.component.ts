import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AddCityComponent } from '../../acounts-modals/add-city/add-city.component';
import { from } from 'rxjs';
@Component({
  selector: 'city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  data = [];


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getpageData();
    this.common.currentPage = 'city';
    this.common.refresh = this.refresh.bind(this);

  }

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
    this.api.post(' accounts/GetState', params)
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
      this.common.params.title = 'Ware house';
      const activeModal = this.modalService.open(AddCityComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.updateWareHouse(data.wareHouse, city.id);
          return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(AddCityComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addWareHouse(data.city);
          return;
        }
      });
    }
  }


  addWareHouse(city) {
    console.log('wareHouse', city);
    const params = {
      name: city.name,
      foid: 123,
      x_id: 0
    };
    console.log('params11: ', params);
    return;
    this.common.loading++;
    this.api.post('Company/InsertWarehouse', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_warehouse;
        if (result == '') {
          this.common.showToast("Add Successfull  ");
        }
        else {
          this.common.showToast(result);
        }
        this.getpageData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  updateWareHouse(wareHouse, rowid) {
    console.log('updated data', wareHouse);
    const params = {
      name: wareHouse.name,
      foid: 123,
      parentid: wareHouse.account.id,
      primarygroupid: wareHouse.account.primarygroup_id,
      x_id: rowid
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Company/InsertWarehouse', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_warehouse;
        if (result == '') {
          this.common.showToast(" Updated Sucess");
        }
        else {
          this.common.showToast(result);
        }
        this.getpageData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
}

