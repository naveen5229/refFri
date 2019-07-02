import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'add-freight-revenue',
  templateUrl: './add-freight-revenue.component.html',
  styleUrls: ['./add-freight-revenue.component.scss']
})
export class AddFreightRevenueComponent implements OnInit {
  revenue = {
    vehicleType: 1,
    vehicleId: null,
    vehicleRegNo: null,
    refernceType: 0,
    date: new Date(),
    shortage: null,
    damage: null,
    delay: null,
    loadDestination: null,
    unloadDestination: null,
    tolls: null,
    amount: null,
    remark: null,
    refId: null
  };
  refernceData = [];
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService) {
    this.common.handleModalSize('class', 'modal-lg', '1100');
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  resetData(type) {
    console.log('Type:', type.target.value);

    this.revenue.vehicleType = type.target.value;
  }
  resetvehicle(vehicleid) {
    this.revenue.vehicleId = null;
    this.revenue.vehicleRegNo = null;
  }
  getvehicleData(vehicle) {
    this.revenue.vehicleId = vehicle.id;
    this.revenue.vehicleRegNo = vehicle.regno;
  }

  refernceTypes(typeid) {
    let type = typeid.target.value;
    let url = null;
    let params = {
      vid: this.revenue.vehicleId,
      regno: this.revenue.vehicleRegNo
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
      default:

    }

    this.common.loading++;

    console.log("params", params);
    this.api.post(url, params)
      .subscribe(res => {
        this.common.loading--;
        this.refernceData = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }



  saveRevenue() {
    ++this.common.loading;
    let params = {
      vid: this.revenue.vehicleId,
      regno: this.revenue.vehicleRegNo,
      vehasstype: this.revenue.vehicleType,
      ref_type: this.revenue.refernceType,
      ref_id: this.revenue.refId,
      amount: this.revenue.amount,
      dttime: this.common.dateFormatter(this.revenue.date),
      short_penality: this.revenue.shortage,
      damage_penality: this.revenue.damage,
      delay_penality: this.revenue.delay,
      load_detention: this.revenue.loadDestination,
      unload_dentention: this.revenue.unloadDestination,
      tolls: this.revenue.tolls,
      freight_rate_id: null,
      remarks: this.revenue.remark

      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);


    this.api.post('FrieghtRate/saveRevenue', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {

          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ data: true });
        }
        else {
          this.common.showError(res['data'][0].y_msg);

        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }



}
