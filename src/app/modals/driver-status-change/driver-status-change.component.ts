import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public formbuilder: FormBuilder) {

    this.Regno = this.common.params.driver.regno;
    this.getdriverStatus();
    // if (this.common.params.md_name) {
    //   this.name = this.common.params.md_name;
    //   this.mobile=this.common.params.md_no;
    //   console.log("Params:", this.name);
    //  // this.mobile=this.common.params.mobileno;
    // }
    if (this.common.params.driver.md_name) {
      this.name = this.common.params.driver.md_name;
      this.mobile = this.common.params.driver.md_no;
    } else {
      this.name = this.common.params.driver.sd_name;
      this.mobile = this.common.params.sd_no;
    }

  }



  ngOnInit() {
    //if(this.common.params.driver.md_name||this.common.params.driver.md_no){

    this.driverStatusForm = this.formbuilder.group({
      name: [this.name],
      mobileno: [this.mobile],
      Status: [this.driverStatus, [Validators.required]],
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
        console.log("Driver Status:", this.driverStatus);
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
