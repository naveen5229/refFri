import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {

  driver={
    name:null,
    license:null,
    mobileNo:null
  
  }
  
    constructor(public api: ApiService,
      public common: CommonService,
      public user: UserService,
      public activeModal: NgbActiveModal,
      private modalService: NgbModal,) { }
  
    ngOnInit() {
    }
  
    closeModal() {
      this.activeModal.close();
    }
  
    addDriver() {
      let params = {
        driverName:this.driver.name,
        mobileNo:this.driver.mobileNo,
        license:this.driver.license
  
      }
      console.log("params", params);
      ++this.common.loading;
      this.api.post('Booster/addBoosterDetails', params)
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
