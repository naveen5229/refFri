import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'single-vehicle-gps-data',
  templateUrl: './single-vehicle-gps-data.component.html',
  styleUrls: ['./single-vehicle-gps-data.component.scss']
})
export class SingleVehicleGpsDataComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  vehicleId = null;
  regNo = null;
  resultData = [];
  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public api: ApiService) {
  }

  closeModal() {
    this.activeModal.close();
  }


  ngOnDestroy(){}
ngOnInit() {
  }

  selectVehicle(vehicle){
    this.vehicleId = vehicle.id;
    this.regNo = vehicle.regno;
  }
 
  addGpsData() {
    let params = "vehicleId=" +this.vehicleId+
      "&startTime=" +this.common.dateFormatter(this.startDate)+
      "&endTime=" +this.common.dateFormatter(this.endDate)+
      "&regno=" +this.regNo
    
    console.log("params", params);
    this.common.loading++;
    this.api.get('GpsData/getVehicleWiseGpsData.json?'+params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        console.log(err); 
      });

  }

}