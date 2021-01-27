import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'bulk-vehicle-next-service-detail',
  templateUrl: './bulk-vehicle-next-service-detail.component.html',
  styleUrls: ['./bulk-vehicle-next-service-detail.component.scss']
})
export class BulkVehicleNextServiceDetailComponent implements OnInit {
  serviceDatas = [];
  btntxt = 'Update';
  kmCopy = null;
  monthCopy = null;

  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.getNextServiceEntries()
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  getNextServiceEntries() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/vehiclesDetailView?')
      .subscribe(res => {
        this.common.loading--;
        this.serviceDatas = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  saveData() {
    this.common.loading++;
    let params = { NextServiceData: JSON.stringify(this.serviceDatas) };

    this.api.post('VehicleMaintenance/bulkUpdateNextServiceDetail', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Successfully added", 3000);

        } else
          this.common.showError(res['data'][0].y_msg);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  copyAll() {
    for (const serviceData in this.serviceDatas) {
      if (this.serviceDatas.hasOwnProperty(serviceData)) {
        if (!this.serviceDatas[serviceData].r_kms) {
          this.serviceDatas[serviceData].r_kms = this.kmCopy;
        }
        if (!this.serviceDatas[serviceData].r_months) {
          this.serviceDatas[serviceData].r_months = this.monthCopy;
        }
      }
    }

  }
}
