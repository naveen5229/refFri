import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'driver-attendance-update',
  templateUrl: './driver-attendance-update.component.html',
  styleUrls: ['./driver-attendance-update.component.scss']
})
export class DriverAttendanceUpdateComponent implements OnInit {
   name=null;
   date=null;
   attendance=null;
  constructor(
    public common:CommonService,
    public activeModal:NgbActiveModal,
  ) {
    this.name=this.common.params.details.name;
   //this. this.date=this.common.params.arrdriverData.days;
    this.attendance=this.common.params.attendance;
    this.date=this.common.params.days;
   }
   closeModal(){
    this.activeModal.close({response:true});
  }
  ngOnDestroy(){}
ngOnInit() {
  }
  NewStatus(){
    this.closeModal();
  }

}
