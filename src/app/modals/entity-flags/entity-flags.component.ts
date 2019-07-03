import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'entity-flags',
  templateUrl: './entity-flags.component.html',
  styleUrls: ['./entity-flags.component.scss']
})
export class EntityFlagsComponent implements OnInit {
  title = null;
  entityFlag = {
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: null,
    refId: null,
    refTypeName: null,
    date: new Date(),
    getTypeMaster: null

  }
  refernceData = [];
  mastertypes = [];
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService, ) {
    this.title = this.common.params.title ? this.common.params.title : '';
    this.getType();
  }

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


  resetType() {

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


}
