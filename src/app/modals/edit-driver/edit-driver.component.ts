import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { dateFieldName } from '@progress/kendo-angular-intl';
@Component({
  selector: 'edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss']
})
export class EditDriverComponent implements OnInit {
 
  submitted = false;
  base64Data=null;
  isLCType = [];
  driverForm: FormGroup;
  dlTypesData = null;
  dlTypes = [];
  driver = {
    name: null,
    date: null,
    mobileno: null,
    mobileno2: null,
    Salary: null,
    guranter: null,
    guranterno: null,
    dateofbirth: null,
    address: null,
    // dlExpiryDate: null,
    dlType: null,
    bankName: null,
    accountNo: null,
    ifscCode: null,
    driverImg: null,
    driverId: null
  }

  bGConditions = [
    {
      key: 'id',
      class: 'highlight-blue',
      isExist: true
    }
  ];
  selectedDLType = [];


  constructor(private apiservice: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private activeModal: NgbActiveModal) {
    this.isLCType = [
      { name: 'HGMV', id: 'HGMV' },
      { name: 'MGV', id: 'MGV' },
      { name: 'HMV', id: 'HMV' },
      { name: 'LMV', id: 'LMV' },
      { name: 'HPMV/HTV', id: 'HPMV' },
      { name: 'Trailer', id: 'Trailer' }
    ]
    console.log("LCType:", this.isLCType);
    console.info("driver Data:", this.common.params.driver);

    if (this.common.params.driver.doj) {
      this.driver.date = new Date(this.common.params.driver.doj);
      console.log("DriverDate:", this.driver.date);
    }
    if (this.common.params.driver.photo) {
      this.driver.driverImg = this.common.params.driver.photo;
    }
    if (this.common.params.driver.dob) {
      this.driver.dateofbirth = new Date(this.common.params.driver.dob);
    }
    console.log('common.params.driver.licence_type:', this.common.params.driver.licence_type);
    // setTimeout(() => {
      this.selectedDLType = [{ name: this.common.params.driver.licence_type }];
    //   console.log('selectedDLType:', this.selectedDLType);
    //   this.cdr.detectChanges();
    // }, 10000);
  }

  ngOnInit() {
    console.log("Driver:", this.common.params.driver);
    this.driverForm = this.formbuilder.group({
      name: [this.common.params.driver.empname],
      mobileno: [this.common.params.driver.mobileno, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobileno2: [this.common.params.driver.mobileno2, [Validators.minLength(10), Validators.maxLength(10)]],
      guranterno: [this.common.params.driver.guarantor_mobileno, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      Salary: [this.common.params.driver.salary],
      guranter: [this.common.params.driver.guarantor_name],
      date: [this.driver.date],
      dateofbirth: [this.driver.dateofbirth],
      address: [this.common.params.driver.address ? this.common.params.driver.address : this.driver.address],
      // dlExpiryDate: [this.driver.dlExpiryDate],
      dlType: [this.common.params.driver.licence_type ? this.common.params.driver.licence_type : this.dlTypesData],
      bankName: [this.common.params.driver.bank_name ? this.common.params.driver.bank_name : this.driver.bankName],
      accountNo: [this.common.params.driver.bank_acno ? this.common.params.driver.bank_acno : this.driver.accountNo],
      ifscCode: [this.common.params.driver.ifsc_code ? this.common.params.driver.ifsc_code : this.driver.ifscCode
      ],
      driverImg: [this.driver.driverImg],
      driverId: [this.common.params.driver.id ? this.common.params.driver.id : null]
    });
 
    if(this.driver.driverImg){
      this. toDataUrl(this.driver.driverImg, myBase64  => {
          console.log("MyBase64:",myBase64);
          // console.log("driverImg:",this.driver.driverImg)
          this.base64Data=myBase64;
          console.log("baseData:",this.base64Data);
     });  
     
     }
    console.log("driverForm", this.driverForm);
  }

  get f() { return this.driverForm.controls; }

  closeModal() {
    this.activeModal.close({ response: true });
  }

  selectDLTypes(dlTypes) {
    this.dlTypes = dlTypes;
  }

  handleFileSelection(event) {
    this.common.loading++;
    console.log("EVENT:",event.target.files[0]);
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


  toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}



  Updatedriver() {
    let base64Data='';
    if (this.dlTypes) {
      this.dlTypesData = this.dlTypes.map(dltype => dltype.id).join(',');
    } else {
      this.dlTypesData = '';
    }
    
    let params = {
      name: this.driverForm.controls.name.value,
      doj: this.common.dateFormatter(this.driver.date),
      mobileNo: this.driverForm.controls.mobileno.value,
      mobileNo2: this.driverForm.controls.mobileno2.value,
      salary: this.driverForm.controls.Salary.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
      dob: this.common.dateFormatter(this.driver.dateofbirth),
      address: this.driverForm.controls.address.value,
      // dlexpdt:this.driver.dlExpiryDate,
      dltype: this.dlTypesData,
      bankName: this.driverForm.controls.bankName.value,
      accNumber: this.driverForm.controls.accountNo.value,
      ifscCode: this.driverForm.controls.ifscCode.value,
      driverImg: this.driver.driverImg ? this.base64Data:this.driver.driverImg,
      driverId: this.driverForm.controls.driverId.value
    };
    console.log("params:", params);
    this.common.loading++;
    this.apiservice.post('Drivers/addEditDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);
        this.closeModal();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
