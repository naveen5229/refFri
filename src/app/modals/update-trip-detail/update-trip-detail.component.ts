import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'update-trip-detail',
  templateUrl: './update-trip-detail.component.html',
  styleUrls: ['./update-trip-detail.component.scss']
})
export class UpdateTripDetailComponent implements OnInit {
  prevehicleId = '';
  vehicleTrip = {
    targetTime: null,
    startTime: null,
    VehicleId: null,
    startName: null,
    endName: null,
    tripId: null,
    tripTypeId: null,
    vehicleRegNo: null
  }


  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    console.log("vehicle Trip", this.common.params.vehicleTrip);
    this.vehicleTrip.tripId = this.common.params.vehicleTrip._tripid;
    this.vehicleTrip.tripTypeId = this.common.params.vehicleTrip.trip_type_id;
    this.vehicleTrip.VehicleId = this.common.params.vehicleTrip.vehicle_id;
    this.vehicleTrip.vehicleRegNo = this.common.params.vehicleTrip.regno;
    this.vehicleTrip.startName = this.common.params.vehicleTrip.start_name?this.common.params.vehicleTrip.start_name:this.common.params.vehicleTrip._origin;
    this.vehicleTrip.startTime = this.common.params.vehicleTrip.start_time?this.common.params.vehicleTrip.start_time:this.common.params.vehicleTrip._startdate;
    this.vehicleTrip.endName = this.common.params.vehicleTrip.end_name?this.common.params.vehicleTrip.end_name:this.common.params.vehicleTrip._destination;
    this.vehicleTrip.targetTime = this.common.params.vehicleTrip.end_time;
  
    this.vehicleTrip.startName = this.vehicleTrip.startName.split("#")[0];
    this.vehicleTrip.endName = this.vehicleTrip.endName.split("#")[0];
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getDate(type) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        // if(type=='start')
        // this.startTime = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        if (type == 'end')
          this.vehicleTrip.targetTime = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
      }
    });
  }
  closeModal() {
    this.activeModal.close();
  }
  updateTrip() {
    this.vehicleTrip.startTime = this.common.dateFormatter(this.vehicleTrip.startTime);
    this.vehicleTrip.targetTime = this.common.dateFormatter(this.vehicleTrip.targetTime);
    let params = {
      vehicleId: this.vehicleTrip.VehicleId,
      startTrip: this.vehicleTrip.startName,
      endTrip: this.vehicleTrip.endName,
      tripTypeId: this.vehicleTrip.tripTypeId,
      tripId: this.vehicleTrip.tripId,
      startTime: this.vehicleTrip.startTime,
      endTime: this.vehicleTrip.targetTime,

    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('VehicleTrips/updateTripDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['msg']);
        this.common.showToast(res['msg']);
        this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }
}
