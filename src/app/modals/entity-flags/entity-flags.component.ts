import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'entity-flags',
  templateUrl: './entity-flags.component.html',
  styleUrls: ['./entity-flags.component.scss', './../../pages/pages.component.css']
})
export class EntityFlagsComponent implements OnInit {
  title = null;
  entityFlag = {
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 0,
    refId: null,
    refTypeName: null,
    date: new Date(),
    flagType: null,
    entityType: 1,
    entityTypeId: null,
    entityName: null,
    remark: null

  }
  refernceData = [];
  mastertypes = [];
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService, ) {
    this.common.handleModalSize('class', 'modal-lg', '800');
    this.title = this.common.params.title ? this.common.params.title : '';
    this.entityFlag.vehicleId = this.common.params.vehicleId ? this.common.params.vehicleId : null;

    this.entityFlag.vehicleRegNo = this.common.params.regno ? this.common.params.regno : null;

    this.getType();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getvehicleData(vehicle) {
    this.entityFlag.vehicleId = vehicle.id;
    this.entityFlag.vehicleRegNo = vehicle.regno;
  }
  resetvehicle() {
    document.getElementById('vehicleno')['value'] = '';
    this.entityFlag.vehicleId = null;
    this.entityFlag.vehicleRegNo = null;
    this.resetRefernceType();
  }
  // resetDriver() {
  //   document.getElementById('driverData')['value'] = '';

  // }
  resetRefernceType(isReset = true) {
    document.getElementById('referncetype')['value'] = '';
    if (isReset)
      this.entityFlag.refernceType = null;
    this.refernceData = [];
  }


  refernceTypes() {
    let type = this.entityFlag.refernceType + "";
    let url = null;
    let params = {
      vid: this.entityFlag.vehicleId,
      regno: this.entityFlag.vehicleRegNo
    };

    switch (type) {
      case '11':
        url = "Suggestion/getLorryReceipts";
        break;
      case '12':
        url = "Suggestion/getLorryManifest";
        break;
      case '13':
        url = "Suggestion/getVehicleStates";
        break;
      case '14':
        url = "Suggestion/getVehicleTrips";
        break;
      default:
        url = null;
        return;

    }
    console.log("params", params);
    this.api.post(url, params)
      .subscribe(res => {
        this.refernceData = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getDriverType() {

  }



  selectList(entityTypeId) {
    console.log("TypeList Id:", entityTypeId);
    this.entityFlag.entityType = entityTypeId;
    console.log("TypeList Id2:", this.entityFlag.entityType);


  }

  getType() {
    this.api.get("Suggestion/getTypeMaster?typeId=54")
      .subscribe(res => {
        this.mastertypes = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  saveEntityFlags() {
    let params = {
      vid: this.entityFlag.vehicleId,
      ref_type: this.entityFlag.refernceType,
      ref_id: this.entityFlag.refId,
      ref_name: this.entityFlag.refTypeName,
      dttime: this.common.dateFormatter(this.entityFlag.date),
      entity_type: this.entityFlag.entityType,
      entity_id: this.entityFlag.entityTypeId,
      entity_name: this.entityFlag.entityName,
      flag_type: this.entityFlag.flagType,
      remarks: this.entityFlag.remark,
    }
    this.api.post("Drivers/saveEntityFlags", params)
      .subscribe(res => {
        console.log("Data", res['data']);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ data: true });
        }
        else {
          this.common.showError(res['data'][0].y_msg);

        }
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


}
