import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'driver-distance',
  templateUrl: './driver-distance.component.html',
  styleUrls: ['./driver-distance.component.scss']
})
export class DriverDistanceComponent implements OnInit {
  distObj = {};
  data = 0;
  distance = 0;
  title = '';

  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.title = this.common.params.title;
      let today = new Date();
      let strcurdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      today.setDate(today.getDate() - 1);
      let stryesterday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.distObj = {vehicleId: this.common.params.distObj, fromTime : stryesterday, tTime : strcurdate};
      console.log("common params:");
      console.log(this.common.params);
      console.log(this.distObj);
      this.getDriverDistance();
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getDriverDistance() {
    this.common.loading++;
    this.api.post('Vehicles/getVehDistanceBwTime', this.distObj)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        if(this.data > 0)
        this.distance = Math.round((this.data/1000) * 100)/100;
        
      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }
}
