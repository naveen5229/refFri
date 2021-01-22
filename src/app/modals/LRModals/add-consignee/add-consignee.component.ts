import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-consignee',
  templateUrl: './add-consignee.component.html',
  styleUrls: ['./add-consignee.component.scss']
})
export class AddConsigneeComponent implements OnInit {
  isFormSubmit = false;
  Form: FormGroup;
  consignee = {
    name: null,
    address: null,
    panNo: "",
   // mobileNo: null,
    gstNo: null
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal, ) {
    this.common.handleModalSize('class', 'modal-lg', '500', 'px', 1);
  }

  ngOnDestroy(){}
ngOnInit() {
    this.Form = this.formBuilder.group({
      name: ['', Validators.required],
      address: [''],
      gstNo: [''],
      panNo: ['', [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]],
    //  mobileNo: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }


  closeModal() {
    this.activeModal.close();
  }
  checkFormat() {
    this.consignee.panNo = (this.consignee.panNo).toUpperCase();

  }

  addConsignee() {
    let params = {
      pan: this.consignee.panNo,
      name: this.consignee.name,
      //mobileNo: this.consignee.mobileNo,
      address: this.consignee.address,
      gstNo: this.consignee.gstNo

    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('LorryReceiptsOperation/InsertCompanies', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        alert(res['data'][0].y_msg);
        if (res['data'][0].y_id > 0)
          this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }


}
