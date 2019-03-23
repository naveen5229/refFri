import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'new-driver-status',
  templateUrl: './new-driver-status.component.html',
  styleUrls: ['./new-driver-status.component.scss']
})
export class NewDriverStatusComponent implements OnInit {
  driverStatus =[];
  mobileno=null;
  Regno=null;
  constructor(
    public api:ApiService,
    public common:CommonService,
    private activeModal : NgbActiveModal,

  ) { 
     //this.Regno=this.common.params.driver.regno;
     this.getdriverStatus();
  }
  getvehicleData(fodriver){
    this.mobileno =fodriver.mobileno;
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
        console.log("Driver Status:", this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

}
