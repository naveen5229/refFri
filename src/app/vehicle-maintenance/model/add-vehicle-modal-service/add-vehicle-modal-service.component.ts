import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-vehicle-modal-service',
  templateUrl: './add-vehicle-modal-service.component.html',
  styleUrls: ['./add-vehicle-modal-service.component.scss']
})
export class AddVehicleModalServiceComponent implements OnInit {
  title = '';
  brands = [];
  selectedEuro = null;
  euros = [
    "BS 1",
    "BS 2",
    "BS 3",
    "BS 4",
    "BS 6",
  ];
  modelId = null;
  brandId = null;
  isWarranty = 1;
  serviceNo = 1;
  nextMonth = null;
  nextKm = null;
  edit = 0;
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.vehicleModalTypes();
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  closeModal(response) {
    this.activeModal.close({ response: this.brandId });
  }

  vehicleModalTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleModelsMaster?brandId=-1')
      .subscribe(res => {
        this.common.loading--;
        this.brands = res['data'];
        console.log("Maintenance Type", this.brands);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  addVehicleModel() {
    let params = {
      euro: this.selectedEuro,
      modelId: this.modelId ? this.modelId : null,
      serviceNo: this.isWarranty == 1 ? this.serviceNo : -1,
      nextKm: this.nextKm,
      nextMonth: this.nextMonth
    };
    console.log("Params:", params);
    this.common.loading++;
    this.api.post('VehicleMaintenance/addModelService', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].r_id > 0) {
          this.common.showToast(res['data'][0].r_msg);
          this.nextKm = null;
          this.nextMonth = null;
        }
        else {
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}

