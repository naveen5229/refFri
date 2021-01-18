import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'gps-enabled-disabled',
  templateUrl: './gps-enabled-disabled.component.html',
  styleUrls: ['./gps-enabled-disabled.component.scss']
})
export class GpsEnabledDisabledComponent implements OnInit {
  Gpsdetail = [];
  is_gps = "";

  constructor(
    public activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,

  ) {
    this.Gpsdetail = this.common.params;
    console.log('gps', this.common.params);
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  changeGpsValue() {
    let params = {
      id: this.common.params[0].id,
      is_gps: this.is_gps
    };
    this.common.loading++;
    console.log("pa", params)
    this.api.post('GpsData/updateGpsStatus', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('responsecode: ', res['responsecode']);

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}