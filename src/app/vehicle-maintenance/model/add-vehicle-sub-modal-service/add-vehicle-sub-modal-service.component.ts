import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-vehicle-sub-modal-service',
  templateUrl: './add-vehicle-sub-modal-service.component.html',
  styleUrls: ['./add-vehicle-sub-modal-service.component.scss']
})
export class AddVehicleSubModalServiceComponent implements OnInit {
  modelId = null;
  serviceDatas = [];
  kmCopy = null;
  monthCopy = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.modelId = this.common.params.modelId;
    this.getNextServiceEntries();
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  closeModal(data) {
    this.activeModal.close(data);
  }
  getNextServiceEntries() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/viewSubModalService?brandId=-1'
      + '&modelId=' + (this.modelId || -1)
      + "&mapping=0")
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
    let params = { details: JSON.stringify(this.serviceDatas), modelId: this.modelId };

    this.api.post('VehicleMaintenance/addSubModelService', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].r_id > 0) {
          this.common.showToast(res['data'][0].r_msg);
          this.closeModal({ response: true, modelId: this.modelId });
        } else
          this.common.showError(res['data'][0].r_msg);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  copyAll(type) {
    for (const serviceData in this.serviceDatas) {
      if (this.serviceDatas.hasOwnProperty(serviceData)) {
        if (!this.serviceDatas[serviceData].kms && type == 1) {
          this.serviceDatas[serviceData].kms = this.kmCopy;
        }
        if (!this.serviceDatas[serviceData].months && type == 2) {
          this.serviceDatas[serviceData].months = this.monthCopy;
        }
      }
    }

  }
}

