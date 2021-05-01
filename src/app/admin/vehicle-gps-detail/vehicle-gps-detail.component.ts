import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-gps-detail',
  templateUrl: './vehicle-gps-detail.component.html',
  styleUrls: ['./vehicle-gps-detail.component.scss']
})
export class VehicleGpsDetailComponent implements OnInit {

  gpsDtails = [];
  foid;

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh(){
    this.getVehicleGpsDetail();
  }

  getFoList(list) {
    this.foid = list.id;
    console.log('foid: ', this.foid);
    this.getVehicleGpsDetail();

  }

  getVehicleGpsDetail() {
    this.common.loading++;
    const params = "foid=" + this.foid;
    //console.log('params',params);
    this.api.get('GpsData/getVehicleGpsDetail?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.gpsDtails = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

}
