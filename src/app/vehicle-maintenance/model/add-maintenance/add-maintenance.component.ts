import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss', '../../../pages/pages.component.css']
})
export class AddMaintenanceComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  btn3 = 'Submit'
  isFormSubmit = false;
  vehicleId = null;
  regno = null;
  serviceType = [];
  serviceId = null;
  typeId = null;
  isItem = 0;
  isChecks = {};
  serviceDetails = {
    lastServiceDate: null,
    serviceCategory: '1',
    scheduleServices: "true",
    lastServiceKm: null,
    nextServiceDate: null,
    nextServiceKm: null,
    serviceCenter: null,
    serviceLocation: null,
    amount: null,
    labourCost: null,
    remark: null,
  }
  services = [];
  items = [
    {
      name: null,
      quantity: null,
      amount: null,
    },
    {
      name: null,
      quantity: null,
      amount: null,
    }];
  edit = 0;
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

  addService() {
    let params = {
      id: this.serviceId ? this.serviceId : null,
      vId: this.vehicleId,
      regno: this.regno,
      isScheduledService: this.serviceDetails.scheduleServices,
      serviceCategory: this.serviceDetails.serviceCategory,
      lastServiceDate: this.common.dateFormatter(this.serviceDetails.lastServiceDate),
      lastServiceKm: this.serviceDetails.lastServiceKm,
      nextServiceDays: null,
      nextServiceKm: null,
      serviceCenter: this.serviceDetails.serviceCenter,
      serviceLocation: this.serviceDetails.serviceLocation,
      amount: this.serviceDetails.amount,
      labourCost: this.serviceDetails.labourCost,
      remark: this.serviceDetails.remark,
      items: JSON.stringify(this.items),
      services: this.arrayToString(this.services)
    };
    console.log("Params:", params);
    this.common.loading++;
    this.api.post('VehicleMaintenance/add', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Sucessfully Added", 10000);
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
  arrayToString(array) {
    let res = "";
    array.forEach(element => {
      res += element + ",";
    });
    res = res == "" ? "" : res.substr(0, res.length - 1);
    return res;
  }

  addMoreItems(index) {
    console.log("addmore items on ", index);
    this.items.push({
      name: null,
      quantity: null,
      amount: null
    }
    );
  }
  // copiedDate() {
  //   for (let i = 0; i < this.services.length; i++) {
  //     this.services[i].nextServiceDate = this.serviceDetails.nextServiceDate;
  //   }
  // }
  // copiedKm() {
  //   for (let i = 0; i < this.services.length; i++) {
  //     this.services[i].nextServiceKm = this.serviceDetails.nextServiceKm;
  //   }
  // }

  addType(serviceId, isCheck) {
    if (isCheck)
      this.services = this.common.unionArrays(this.services, [serviceId]);
    else
      this.services.splice(this.services.findIndex((element) => { return element == serviceId }), 1);
  }
}
