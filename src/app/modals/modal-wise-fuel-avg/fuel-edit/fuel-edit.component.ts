import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../../change-vehicle-status/change-vehicle-status.component';
import { ImageViewComponent } from '../../image-view/image-view.component';
import { from } from 'rxjs';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-edit',
  templateUrl: './fuel-edit.component.html',
  styleUrls: ['./fuel-edit.component.scss']
})
export class FuelEditComponent implements OnInit {
  data = [];
  name = null;
  loadAvg = null;
  unloadAvg = null;
  vehModel = null;
  isUpdate: boolean;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.name = this.common.params.req.name;
    this.data = this.common.params.req;
    this.vehModel = this.common.params.req.vehicle_model;
    if (this.common.params.req.load_avg && this.common.params.req.unload_avg) {
      this.loadAvg = this.common.params.req.load_avg;
      this.unloadAvg = this.common.params.req.unload_avg;
      this.isUpdate = this.loadAvg != null && this.unloadAvg != null;
    }
    console.log('respomse', this.data);
  }
  closeModal() {
    this.activeModal.close();

  }
  ngOnDestroy(){}
ngOnInit() {
  }
  change() {
    if (this.isUpdate) {
      let params = {
        vehicle_model: this.vehModel,

        load_avg: this.loadAvg,
        unload_avg: this.unloadAvg,
      }
      this.common.loading++;
      let response;
      this.api.post('FuelDiagnosis/updateModelWiseFuelAverage', params)
        .subscribe(res => {
          if (res['code'] == 1) {
            this.activeModal.close({ response: res });

          }
          this.common.loading--;
        }, err => {
          this.common.loading--;
          console.log(err);
        });
      return response;
    }
    else {
      let params = {
        vehicle_model: this.vehModel,

        load_avg: this.loadAvg,
        unload_avg: this.unloadAvg,
      }
      this.common.loading++;
      let response;
      this.api.post('FuelDiagnosis/setModelWiseFuelAverage', params)
        .subscribe(res => {
          if (res['code'] == 1) {
            this.activeModal.close({ response: res });
          }
          this.common.loading--;
        }, err => {
          this.common.loading--;
          console.log(err);
        });
      return response;
    }


  }
}

