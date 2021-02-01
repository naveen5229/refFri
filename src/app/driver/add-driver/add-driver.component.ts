import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  driverForm: FormGroup;
  submitted = false;

  driver = {
    name: null,
    date: this.common.dateFormatter(new Date()),
    mobileno: null,
    driverphoto: null,
    lisenceno: null,
    lisencephoto: null,
    aadharno: null,
    aadharphoto: null,
    Salary: null,
    guranter: null,
    guranterno: null,
    doj: null
  }
  constructor(
    public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private apiservice: ApiService) {

  }

  ngOnDestroy(){}
ngOnInit() {
    this.driverForm = this.formbuilder.group({
      name: [''],
      mobileno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      guranterno: [''],
      lisenceno: [''],
      uploadPhoto: [''],
      lisencephoto: [''],
      aadharno: [''],
      aadharphoto: [''],
      Salary: [''],
      guranter: [''],
      date: ['']
    })
  }

  get f() { return this.driverForm.controls; }




  getDate() {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.driver.date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.driver.date);
    });
  }

  handleFileSelection(event, index) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }

        console.log('Base 64: ', res);
        // this.driver['image' + index] = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  addNewdriver() {


    let response;
    //this.submitted = true;
    let params = {
      name: this.driverForm.controls.name.value,
      mobileNo: this.driverForm.controls.mobileno.value,
      photo: this.driverForm.controls.uploadPhoto.value,
      licenceNo: this.driverForm.controls.lisenceno.value,
      licencePhoto: this.driverForm.controls.lisencephoto.value,
      aadharNo: this.driverForm.controls.aadharno.value,
      aadharPhoto: this.driverForm.controls.aadharphoto.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
    };
    console.log("Data:",params);
    this.common.loading++;
    this.apiservice.post('/Drivers/add', params )
      .subscribe(res => {

        this.common.loading--;
        console.log('Res:', res['data']);
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
      
    

  }

}

