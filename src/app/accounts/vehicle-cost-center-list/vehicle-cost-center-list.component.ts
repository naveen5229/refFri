import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-cost-center-list',
  templateUrl: './vehicle-cost-center-list.component.html',
  styleUrls: ['./vehicle-cost-center-list.component.scss']
})
export class VehicleCostCenterListComponent implements OnInit {

  vehCostList = [];
  vehlist = [];

  selectedAll: false;

  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal
  ) {
    this.getVehicleCostCenterList();
    this.common.currentPage = 'Vehicle Cost Center List';
  }

  ngOnDestroy(){}
ngOnInit() {

  }

  getVehicleCostCenterList() {
    this.vehlist = []
    let params = {

    };
    this.common.loading++;
    this.api.post('accounts/getVehCostCenterList', params)
      .subscribe(res => {
        this.common.loading--;
        this.vehCostList = res['data'];
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  selectAll() {


    if (this.selectedAll) {
      for (var i = 0; i < this.vehCostList.length; i++) {
        this.vehCostList[i].selected = this.selectedAll;
        this.vehlist.push(this.vehCostList[i].y_vehicle_name)
      }
    } else {
      for (var i = 0; i < this.vehCostList.length; i++) {
        this.vehCostList[i].selected = false;
        this.vehlist = [];
      }
    }
    console.log('vehList', this.vehlist);

    console.log('select All', this.selectAll);
  }

  changeStatus(vehName) {
    console.log('index', vehName);
    this.vehlist.push(vehName);
    console.log('vehList', this.vehlist);
  }

  saveCostCenterList() {
    let str = 'ARRAY[';
    this.vehlist.map(vehlist => {
      str += `'${vehlist}',`;
    });
    str = str.slice(0, -1) + ']';
    console.log('String::', str);

    let params = {
      cost_center_list: str
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('accounts/saveCostCenterList', params)
      .subscribe(res => {
        this.common.loading--
        console.log('res', res['data']);
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

}
