import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'verifyfuturetripstate',
  templateUrl: './verifyfuturetripstate.component.html',
  styleUrls: ['./verifyfuturetripstate.component.scss']
})
export class VerifyfuturetripstateComponent implements OnInit {

  tripId:null;
  startTime=new Date();
  tripDesc:null;
  stateId:null;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) { 

    this.tripId = this.common.params.verifyTrip.trip_id;
    this.tripDesc= this.common.params.verifyTrip.trip_desc;
    this.stateId=this.common.params.verifyTrip.stateId;
    this.startTime =new Date( this.common.params.verifyTrip.startTime);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  updateTrip() {
    let params = {
      tripId: this.tripId,
      endTime:this.common.dateFormatter(this.startTime),
      stateId:this.stateId
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

  closeModal(){
      this.activeModal.close();
  }
}
