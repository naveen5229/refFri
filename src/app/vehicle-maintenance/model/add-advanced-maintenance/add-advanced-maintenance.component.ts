import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-advanced-maintenance',
  templateUrl: './add-advanced-maintenance.component.html',
  styleUrls: ['./add-advanced-maintenance.component.scss']
})
export class AddAdvancedMaintenanceComponent implements OnInit {

  title = '';
  btn1 = '';
  btn2 = '';
  btn3 = 'Submit'
  edit = 0;
  isFormSubmit = false;
  vehicleId = null;
  regno = null;
  serviceType = [];
  serviceId = null;
  typeId = null;
  serviceDetails = {
    lastServiceDate: null,
    serviceCategory: '1',
    lastServiceKm: null,
    nextServiceDate: null,
    nextServiceKm: null,
    serviceCenter: null,
    serviceLocation: null,
    amount: null,
    remark: null,
  }
  services = [{
    serviceType: null,
    nextServiceKm: null,
    nextServiceDate: null,
    serviceTypeId: null,

    itemDetails: [
      {
        name: null,
        quantity: null,
        amount: null,
      }
    ]
  },
  {
    serviceType: null,
    nextServiceKm: null,
    nextServiceDate: null,
    serviceTypeId: null,
    itemDetails: [
      {
        name: null,
        quantity: null,
        amount: null,
      }
    ]
  },
  {
    serviceType: null,
    nextServiceKm: null,
    nextServiceDate: null,
    serviceTypeId: null,
    itemDetails: [
      {
        name: null,
        quantity: null,
        amount: null,
      }
    ]
  }]
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Vehicle Job Card';
    this.btn1 = this.common.params.btn1 || 'Cancel';
    this.btn2 = this.common.params.btn2 || 'Add';
    this.vehicleId = this.common.params.vehicleId;
    this.regno = this.common.params.regno;
    this.serviceMaintenanceType();

  }

  ngOnDestroy(){}
ngOnInit() {
  }


  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  serviceMaintenanceType() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/getHeadMaster')
      .subscribe(res => {
        this.common.loading--;
        this.serviceType = res['data'];
        console.log("Maintenance Type", this.serviceType);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeServiceType(type, index) {
    console.log("Type Id", type);

    this.services[index].serviceTypeId = this.serviceType.find((element) => {
      return element.name == type;
    }).id;
  }

  addService() {
    let params = {
      id: this.serviceId ? this.serviceId : null,
      vId: this.vehicleId,
      regno: this.regno,
      serviceCategory: this.serviceDetails.serviceCategory,
      lastServiceDate: this.common.dateFormatter(this.serviceDetails.lastServiceDate),
      lastServiceKm: this.serviceDetails.lastServiceKm,
      nextServiceDate: this.common.dateFormatter(this.serviceDetails.nextServiceDate),
      nextServiceKm: this.serviceDetails.nextServiceKm,
      serviceCenter: this.serviceDetails.serviceCenter,
      serviceLocation: this.serviceDetails.serviceLocation,
      amount: this.serviceDetails.amount,
      remark: this.serviceDetails.remark,
      services: JSON.stringify(this.services),
    };
    console.log("Params:", params);
    this.common.loading++;
    this.api.post('VehicleMaintenance/add', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Sucessfully Added");
          this.closeModal(true);
        }
        else {
          this.common.showError(res['data'][0].r_msg);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  addMore() {
    this.services.push({
      serviceType: null,
      nextServiceKm: null,
      nextServiceDate: null,
      serviceTypeId: null,
      itemDetails: [
        {
          name: null,
          quantity: null,
          amount: null,
        }
      ]
    });
  }

  addMoreItems(index) {
    console.log("addmore items on ", index);
    this.services[index].itemDetails.push({
      name: null,
      quantity: null,
      amount: null
    }
    );
  }
  copiedDate() {
    for (let i = 0; i < this.services.length; i++) {
      this.services[i].nextServiceDate = this.serviceDetails.nextServiceDate;
    }
  }
  copiedKm() {
    for (let i = 0; i < this.services.length; i++) {
      this.services[i].nextServiceKm = this.serviceDetails.nextServiceKm;
    }
  }

  dateFormatConversion() {

  }
}

