import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-details-update',
  templateUrl: './vehicle-details-update.component.html',
  styleUrls: ['./vehicle-details-update.component.scss']
})
export class VehicleDetailsUpdateComponent implements OnInit {

  vehicleDetail = [];
  vehicle = {
    id: null,
    regNo: null,
    type: null,
    chassisNo: null,
    gvw: null,
    bsCode: null,
    brandId: null,
    modelId:null,
    bodyTypeId:null,
    capacity: null,
    engineNo: null,
    mfDate : new Date(),
  }
  modelList=[];
  brandList=[];
  bodyTypes=[];
  bsCodes = [];
  btnText = "Submit";
 
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    
    if(this.common.params.vehicle && this.common.params.vehicle.id){
      console.log(this.common.params.vehicle);
      this.vehicle.id = this.common.params.vehicle.id && this.common.params.vehicle.id ? this.common.params.vehicle.id : null ;
      this.displayVehicleInformation();
    }
    else{
    this.getBrandList();
    this.getVehicleBodyTypes();
    this.getBscodes();
  }
  }
  ngOnDestroy(){}
ngOnInit() {
  }
  displayVehicleInformation() {

    this.common.loading++;
    this.api.get('vehicles/getVehicleGeneralInfo?vehicleId=' + this.vehicle.id)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'].length > 0) {
          this.vehicle.regNo = res['data'][0].regno != null ? res['data'][0].regno : null;
          this.vehicle.type = res['data'][0].vehicle_type != null ? res['data'][0].vehicle_type : null;
          this.vehicle.brandId = res['data'][0].vehicle_maker != null ? res['data'][0].vehicle_maker : null;
          this.vehicle.modelId = res['data'][0].vehicle_model != null ? res['data'][0].vehicle_model : null;
          this.vehicle.chassisNo = res['data'][0].chassis_no != null ? res['data'][0].chassis_no : null;
          this.vehicle.gvw = res['data'][0].gvw != null ? res['data'][0].gvw : null;
          this.vehicle.bsCode = res['data'][0].bs_code != null ? res['data'][0].bs_code : null;
          this.vehicle.bodyTypeId = res['data'][0].bodytype_id != null ? res['data'][0].bodytype_id : null;
          this.vehicle.capacity = res['data'][0].capacity != null ? res['data'][0].capacity : null;
          this.vehicle.engineNo = res['data'][0].engine_no != null ? res['data'][0].engine_no : null;
          this.vehicle.mfDate = res['data'][0].manufacture_date!=null?new Date(res['data'][0].manufacture_date):new Date();
          this.btnText = 'Update';
        console.log("this.vehicle.brandId",this.vehicle.brandId);

          if(this.vehicle.brandId){
            this.getVehicleModelList();
          }
          this.getBrandList();
          this.getBscodes();
          this.getVehicleBodyTypes();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getBrandList() {
    this.common.loading++;
    this.api.get('Suggestion/getBrandList?')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.brandList = res['data'];
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getBscodes() {
    this.common.loading++;
    this.api.get('Vehicles/getBsCodes?')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.bsCodes = res['data'];
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  getVehicleBodyTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleBodyTypes?')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.bodyTypes = res['data'];
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getVehicleModelList() {
    this.common.loading++;
    this.api.get('vehicles/getVehicleModelsMaster?brandId='+this.vehicle.brandId)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.modelList = res['data'];
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  updateVehicleDetails() {
    let params = {
    vehicleId : this.vehicle.id,
    vehicleNo : this.vehicle.regNo,
    vehicleType : this.vehicle.type,
    chassisNo : this.vehicle.chassisNo,
    gvw : this.vehicle.gvw,
    bsCode : this.vehicle.bsCode,
    brandId : this.vehicle.brandId,
    modelId : this.vehicle.modelId,
    bodyTypeId : this.vehicle.bodyTypeId,
    capacity: this.vehicle.capacity,
    engineNo: this.vehicle.engineNo,
    mfDate:this.vehicle.mfDate
    }

    console.log('params',params);
    //return;
    this.common.loading++;
    this.api.post('vehicles/updateVehicleDetails',params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data'][0]);
        if (res['data'][0].r_id> 0) {
          this.common.showToast('Successfully Added');
          this.closeModal();
        }else{
          this.common.showError(res['data'][0].r_msg)
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
