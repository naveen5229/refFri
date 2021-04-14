import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-next-service-detail',
  templateUrl: './vehicle-next-service-detail.component.html',
  styleUrls: ['./vehicle-next-service-detail.component.scss']
})
export class VehicleNextServiceDetailComponent implements OnInit {
  vehicleNo = null;
  vehicleId = -1;
  serviceAfterDuration = null;
  serviceAfterKm = null;
  btntxt = 'Update';
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.vehicleId = this.common.params.vehicleId;
    this.vehicleNo = this.common.params.vehicleNo;
    this.getNextServiceEntry();

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  getNextServiceEntry() {
    this.common.loading++;
    let params = "vehicleId=" + this.vehicleId;
    this.api.get('VehicleMaintenance/getNextServiceEntry?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'].length > 0) {
          this.serviceAfterDuration = res['data'][0].months;
          this.serviceAfterKm = res['data'][0].kms;
          this.btntxt = "Update";
        } else {
          this.btntxt = "Save";
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  saveData() {
    this.common.loading++;
    let params = {
      vehicleId: this.vehicleId,
      serviceAfterkm: this.serviceAfterKm,
      serviceAfterMonth: this.serviceAfterDuration
    }
    this.api.post('VehicleMaintenance/addNextServiceDetail', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Successfully added");
          setTimeout(() => {
            this.activeModal.close({ data: res['data'][0].r_id });
          }, 1000);
        } else
          this.common.showError(res['data'][0].r_msg);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close();
  }
}
