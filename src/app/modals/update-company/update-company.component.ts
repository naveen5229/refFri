import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'update-company',
  templateUrl: './update-company.component.html',
  styleUrls: ['./update-company.component.scss']
})
export class UpdateCompanyComponent implements OnInit {
  isFormSubmit = false;
  Form: FormGroup;
  company = {
    name: null,
    pan: null,
    id:null,
    address:'',
    mobileNo:''
  };
  constructor(
    public common : CommonService,
    public api : ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    this.company.name = this.common.params.company.name;
    this.company.pan = this.common.params.company.pan;
    this.company.address = this.common.params.company.address?this.common.params.company.address:'';

    this.company.id = this.common.params.company.id;

   }

  ngOnDestroy(){}
ngOnInit() {
    this.Form = this.formBuilder.group({
      name:['',],
      panNo: ['', [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]],
      address:[''],
      mobileNo:['']
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }
  

  closeModal() {
    this.activeModal.close();
  }


  checkFormat(){
    this.company.pan =  (this.company.pan).toUpperCase();
 
   }
  updateCompany(){
    let params = {
      name : this.company.name,
      id : this.company.id,
      pan : this.company.pan,
      address : this.company.address,
      mobileNo : this.company.mobileNo
    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('Company/updateCompanyDetails', params)
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


