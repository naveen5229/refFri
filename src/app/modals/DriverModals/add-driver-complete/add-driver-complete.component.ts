import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { DatePickerComponent } from '../../date-picker/date-picker.component';
// import{DatePickerComponent}from '../../date-picker/date-picker.component';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { UploadDocsComponent } from '../../upload-docs/upload-docs.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';

@Component({
  selector: 'add-driver-complete',
  templateUrl: './add-driver-complete.component.html',
  styleUrls: ['./add-driver-complete.component.scss']
})
export class AddDriverCompleteComponent implements OnInit {
  driverForm: FormGroup;
  submitted = false;
  dlTypesData=null;
  dlTypes = [];
  isLCType = [];
  driver = {
    name: null,
    mobileno: null,
    mobileno2: null,
    lisenceNumber: null,
    adharNumber: null,
    salary: null,
    guranter: null,
    guranterMobileNo: null,
    doj: new Date(),
    dateofbirth: new Date(),
    address: null,
    dlType: null,
    bankName: null,
    accountNo: null,
    ifscCode: null,
    driverImg:null
  };
  bGConditions = [
    {
      key: 'id',
      class: 'highlight-blue',
      isExist: true
    }
  ];
  addDriverRes = [];
  constructor(public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    public api: ApiService,
    public user: UserService,
    public activeModal: NgbActiveModal) {
    console.log('Driver: ', this.common.params);
    this.isLCType = [
      { name: 'HGMV', id: 'HGMV' },
      { name: 'MGV', id: 'MGV' },
      { name: 'HMV', id: 'HMV' },
      { name: 'LMV', id: 'LMV' },
      { name: 'HPMV/HTV', id: 'HPMV' },
      { name: 'Trailer', id: 'Trailer' }
    ]

  }

  ngOnInit() {
    this.driverForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      mobileno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobileno2: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      guranterno: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      lisenceno: [''],
      aadharno: [''],
      Salary: [''],
      guranter: [''],
      dateofJoin: [''],
      dateofbirth: [''],
      address: [''],
      dlType: [''],
      bankName: [''],
      accountNo: [''],
      ifscCode:[''],
      driverImg:[''],
      driverId:['']
    })
  }
  closeModal() {
    this.driverForm.controls = null;
    this.activeModal.close({ response: true });
  }
  get f() { return this.driverForm.controls; }

  // getDate(type) {
  //   console.log("Testing");
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     if (data.date) {
  //       if (type == 'doj'){
  //         this.driver.doj = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
  //       }
  //       if (type == 'dtbrth'){
  //         this.driver.dateofbirth = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
  //         console.log("dateOfBirth:",this.driver.dateofbirth);
  //       }
  //     }
  //   });
  // }


  selectDLTypes(dlTypes) {
    this.dlTypes = dlTypes;
  }

  handleFileSelection(event) {
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
          this.driver.driverImg = res;
          console.log('Base 64 index 1: ', this.driver.driverImg);
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  addNewdriver() {
    if(this.dlTypes){
      this.dlTypesData = this.dlTypes.map(dltype => dltype.id).join(',');
      }else{
        this.dlTypesData='';
      }
      const params = {
      name: this.driverForm.controls.name.value,
      mobileNo: this.driverForm.controls.mobileno.value,
      mobileNo2: this.driverForm.controls.mobileno2.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
      doj:this.common.dateFormatter(new Date(this.driver.doj)),
      salary: this.driverForm.controls.Salary.value,
      dob:this.common.dateFormatter(new Date(this.driver.dateofbirth)),
      address: this.driverForm.controls.address.value,
      dltype: this.dlTypesData,
      bankName:this.driverForm.controls.bankName.value,
      accNumber: this.driverForm.controls.accountNo.value,
      ifscCode: this.driverForm.controls.ifscCode.value,
      driverImg:this.driver.driverImg,
      driverId:this.driverForm.controls.driverId.value
    };

    console.log("Param:",params);
    this.common.loading++;
    this.api.post('/Drivers/addEditDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
        this.addDriverRes = res['data']
        console.log('Res:', res['data']);
        if (this.addDriverRes[0]) {
          this.common.params = { driverId: this.addDriverRes };
          const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.closeModal();
        } else {
          this.common.showError(res['data'].y_msg);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
