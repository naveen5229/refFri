import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'driver-status-change',
  templateUrl: './driver-status-change.component.html',
  styleUrls: ['./driver-status-change.component.scss']
})
export class DriverStatusChangeComponent implements OnInit {
driverStatus=[];
  constructor(
    public common:CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {
    this.getdriverStatus();
   }

  ngOnInit() {
  }
  getdriverStatus() {
    this.common.loading++;
    let response;
    this.api.get('/Drivers/getStatus')
      .subscribe(res => {
        this.common.loading--;
        
        this.driverStatus = res['data'];
        console.log("Driver Status:",this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  closeModal(){
    this.activeModal.close();
  }
}
