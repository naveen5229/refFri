import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'multi-vehicle-halt-add',
  templateUrl: './multi-vehicle-halt-add.component.html',
  styleUrls: ['./multi-vehicle-halt-add.component.scss']
})
export class MultiVehicleHaltAddComponent implements OnInit {
  startDate = null;
  endDate = null;
  vehicleIds = null;
  resultData = [];
  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public api: ApiService) {
    let today = new Date(), start = new Date();

    this.endDate = today;
    console.log("end Date:", this.endDate);

    start.setDate(today.getDate() - 5);
    this.startDate = start;
    console.log("Start Date:", this.startDate);
  }

  closeModal() {
    this.activeModal.close();
  }

  getDate(type) {

    this.common.params = { ref_page: 'pull-history-gps-data' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  submit() {
    let vehicles = this.vehicleIds.split(',');
    let arr = [];
    vehicles.map(vehicle => {
      this.addHalt(vehicle);
      
    });
  }

  addHalt(vehicle) {
    this.startDate = this.common.dateFormatter(this.startDate).split(' ')[0];
    this.endDate = this.common.dateFormatter(this.endDate).split(' ')[0];
    let params = {
      vehicleId: vehicle,
      fromTime: this.startDate,
      tTime: this.endDate,
      tLat: '0',
      tLong: '0'
    }
    console.log("params", params);
    this.common.loading++;
    this.api.post('AutoHalts/addSingleVehicleAutoHalts', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.resultData.push({
          vehicle: vehicle,
          response: JSON.stringify(res),
        })


      }, err => {
        this.common.loading--;
        console.log(err);
        this.resultData.push({
          vehicle: vehicle,
          response: err,
        })
      });

  }

}
