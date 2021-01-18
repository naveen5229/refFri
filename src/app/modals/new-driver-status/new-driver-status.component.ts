import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'new-driver-status',
  templateUrl: './new-driver-status.component.html',
  styleUrls: ['./new-driver-status.component.scss']
})
export class NewDriverStatusComponent implements OnInit {
  driverStatus = [];
  mobileno = null;
  Regno = null;
  selectedType = '';
  constructor(
    public api: ApiService,
    public common: CommonService,
    private activeModal: NgbActiveModal,

  ) {
    // console.log('Params: ', this.common.params); 
    // this.Regno = this.common.params.driver.regno;
    this.getdriverStatus();
  }
  getvehicleData(fodriver) {
    this.mobileno = fodriver.mobileno;
  }
  getvehicle(vehicle) {
    this.Regno = vehicle.id;
  }
  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
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

  NewStatus(){
    
  }

}
