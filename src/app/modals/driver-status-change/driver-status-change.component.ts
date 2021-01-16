import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'driver-status-change',
  templateUrl: './driver-status-change.component.html',
  styleUrls: ['./driver-status-change.component.scss']
})
export class DriverStatusChangeComponent implements OnInit {
  driverStatus = [];
  name = null;
  mobile = null;
  driverStatusForm: FormGroup;
  submitted = false;
  Regno = null;
  statusID = null;
  id = [];
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public formbuilder: FormBuilder) {

    this.Regno = this.common.params.driver.regno;

    this.getdriverStatus();
    //console.log('....', this.statusID);
    console.log('name', this.common.params.name, 'mobile', this.common.params.mobile);
    if (this.common.params.driver.md_name == this.common.params.name) {
      this.name = this.common.params.driver.md_name;
      this.mobile = this.common.params.driver.md_no;
      this.statusID = '901';

    } if (this.common.params.driver.sd_name == this.common.params.name) {
      this.name = this.common.params.driver.sd_name;
      this.mobile = this.common.params.driver.sd_no;
      this.statusID = '902';
    }

  }



  ngOnDestroy(){}
ngOnInit() {
    //if(this.common.params.driver.md_name||this.common.params.driver.md_no){

    this.driverStatusForm = this.formbuilder.group({
      name: [this.name],
      mobileno: [this.mobile],

      Status: [this.statusID, [Validators.required]],
    });


  }
  get f() { return this.driverStatusForm.controls; }
  getvehicleData(Fodriver) {

  }
  getdriverStatus() {
    this.common.loading++;
    let response;
    this.api.get('/Drivers/getStatus')
      .subscribe(res => {
        this.common.loading--;
        this.driverStatus = res['data'];
        // for (let i = 0; i < this.driverStatus.length; i++) {
        //   this.id = this.driverStatus[i].id;
        //   if (this.driverStatus[i].id == '901') {
        //     this.statusID = '901';

        //   } if (this.driverStatus[i].id == '902') {
        //     this.statusID = '902';
        //   } if (this.driverStatus[i].id == '903') {
        //     this.statusID = '903';
        //   }
        //   console.log("Driver Status:", this.id);
        // }


      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  closeModal() {
    this.activeModal.close({ response: true });
  }

  addNewStatus() {

  }
}
