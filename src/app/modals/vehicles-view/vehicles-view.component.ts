import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vehicles-view',
  templateUrl: './vehicles-view.component.html',
  styleUrls: ['./vehicles-view.component.scss']
})
export class VehiclesViewComponent implements OnInit {

  driverDetail = [];
  driver = {
    regNo: null,
    vehicleType: null,
    vehicleMaker: null,
    vehicleModel: null,
    chassisNo: null,
    gvw: null,
    bsCode: null,
    makerName: null,
    modalName: null,
    bodyType: null,
    capacity: null,
    engineNo: null
  }
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.displayVehicleInformation();
  }

  ngOnInit() {
  }
  displayVehicleInformation() {
    console.log("VehicleId:", this.common.params.vehicleId);
    let vehicleId = this.common.params.vehicleId;
    this.common.loading++;
    this.api.get('vehicles/getVehicleGeneralInfo?vehicleId=' + vehicleId)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.driver.regNo = res['data'][0].regno != null ? res['data'][0].regno : "_";
          this.driver.vehicleType = res['data'][0].vehicle_type != null ? res['data'][0].vehicle_type : "_";
          this.driver.vehicleMaker = res['data'][0].vehicle_maker != null ? res['data'][0].vehicle_maker : "_";
          this.driver.vehicleModel = res['data'][0].vehicle_model != null ? res['data'][0].vehicle_model : "_";
          this.driver.chassisNo = res['data'][0].chassis_no != null ? res['data'][0].chassis_no : "_";
          this.driver.gvw = res['data'][0].gvw != null ? res['data'][0].gvw : "_";
          this.driver.bsCode = res['data'][0].bs_code != null ? res['data'][0].bs_code : "_";
          this.driver.makerName = res['data'][0].make_name != null ? res['data'][0].make_name : "_";
          this.driver.modalName = res['data'][0].model_name != null ? res['data'][0].model_name : "_";
          this.driver.bodyType = res['data'][0].body_type != null ? res['data'][0].body_type : "_";
          this.driver.capacity = res['data'][0].capacity != null ? res['data'][0].capacity : "_";
          this.driver.engineNo = res['data'][0].engine_no != null ? res['data'][0].engine_no : "_";
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  closeModal() {
    this.activeModal.close(true);
  };

}