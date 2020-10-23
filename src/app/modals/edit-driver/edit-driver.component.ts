import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss']
})
export class EditDriverComponent implements OnInit {
  submitted = false;
  isLCType = [];
  driverForm: FormGroup;
  dlTypesData=null;
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
    dlExpiryDate: null,
    dlType: null,
    bankName: null,
    accountNo: null,
    ifscCode: null
  }

  bGConditions = [
    {
      key: 'id',
      class: 'highlight-blue',
      isExist: true
    }
  ];



  constructor(private apiservice: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
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
      this.driver.date = this.common.dateFormatter1(this.common.params.driver.doj);
    }if(this.common.params.driver.expiry_date){
      this.driver.dlExpiryDate=this.common.dateFormatter1(this.common.params.driver.expiry_date);
    }
    if(this.common.params.driver.dob){
      this.driver.dateofbirth=this.common.dateFormatter1(this.common.params.driver.dob);
    }

//     address: "Test"
// bank_acno: "111000111000"
// bank_name: "SBITest"
// dob: "2020-10-20"
// doj: "2020-01-28"
// empname: "Sakir Khan"
// expiry_date: "2020-10-23"
// foid: 6529
// guarantor_mobileno: "9828910283"
// guarantor_name: "Juber"
// id: 12526
// ifsc_code: "ABCD147147"
// licence_type: "HGMV,HMV"
// mobileno: "9079353582"
// mobileno2: "8607725800"
// salary: 10000
    
  }

  ngOnInit() {
    console.log("Driver:",this.common.params.driver);
    this.driverForm = this.formbuilder.group({
      name: [this.common.params.driver.empname],
      mobileno: [this.common.params.driver.mobileno, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobileno2: [this.common.params.driver.mobileno2, [Validators.minLength(10), Validators.maxLength(10)]],
      guranterno: [this.common.params.driver.guarantor_mobileno, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      Salary: [this.common.params.driver.salary],
      guranter: [this.common.params.driver.guarantor_name],
      date: [this.driver.date],
      dateofbirth: [this.driver.dateofbirth],
      address: [this.common.params.driver.address?this.common.params.driver.address:this.driver.address],
      dlExpiryDate: [this.driver.dlExpiryDate],
      dlType: [this.dlTypesData],
      bankName: [this.common.params.driver.bank_name?this.common.params.driver.bank_name:this.driver.bankName],
      accountNo: [this.common.params.driver.bank_acno?this.common.params.driver.bank_acno:this.driver.accountNo],
      ifscCode:[this.common.params.driver.ifsc_code?this.common.params.driver.ifsc_code:this.driver.ifscCode,
        [Validators.required,Validators.pattern(/^[A-Za-z]{4}\d{7}$/)]]
        
      // ifscCode: [Validators.required,Validators.pattern(/^[A-Za-z]{4}\d{7}$/)]
    });
    console.log("driverForm", this.driverForm);
  }

  get f() { return this.driverForm.controls;}

  closeModal() {
    this.activeModal.close({ response: true });
  }

  getDate(type) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'doj'){
          this.driver.date = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        }
        if (type == 'dlexp'){
          this.driver.dlExpiryDate = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        }
        if (type == 'dtbrth'){
          this.driver.dateofbirth = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
          console.log("dateOfBirth:",this.driver.dateofbirth);
        }
      }
    });
  }

  selectDLTypes(dlTypes) {
    this.dlTypes = dlTypes;
  }


  Updatedriver() {
    if(this.dlTypes){
    this.dlTypesData = this.dlTypes.map(dltype => dltype.id).join(',');
    }else{
      this.dlTypesData='';
    }

    let params = {
      name: this.driverForm.controls.name.value,
      doj: this.driver.date,
      mobileNo: this.driverForm.controls.mobileno.value,
      mobileNo2: this.driverForm.controls.mobileno2.value,
      salary: this.driverForm.controls.Salary.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
      dob:this.driver.dateofbirth,
      address: this.driverForm.controls.address.value,
      dlexpdt:this.driver.dlExpiryDate,
      dltype: this.dlTypesData,
      bankName:this.driverForm.controls.bankName.value,
      accNumber: this.driverForm.controls.accountNo.value,
      ifscCode: this.driverForm.controls.ifscCode.value
    };
    this.common.loading++;
    this.apiservice.post('Drivers/edit', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.common.showToast(res['msg']);
        this.closeModal();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
