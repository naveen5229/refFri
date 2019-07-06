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
  driverForm: FormGroup;
  driver = {
    name: null,
    date: null,
    mobileno: null,
    mobileno2: null,
    driverphoto: null,
    lisenceno: null,
    lisencephoto: null,
    aadharno: null,
    aadharphoto: null,
    Salary: null,
    guranter: null,
    guranterno: null,


  }
  licensephoto = null;
  aadharphoto = null;
  driverphoto = null;
  constructor(
    private apiservice: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activeModal: NgbActiveModal) {
    console.info("driver Data:", this.common.params.driver);
    if (this.common.params.driver.licence_photo) {
      this.licensephoto = this.common.params.driver.licence_photo;
      //console.log('photo', this.common.params.driver.licence_photo);
      let temp = this.common.params.driver.licence_photo.split("/docs");

      this.driver.lisencephoto = "/docs" + temp[1];
    }
    if (this.common.params.driver.aadhar_photo) {
      this.aadharphoto = this.common.params.driver.aadhar_photo;
      let temp = this.common.params.driver.aadhar_photo.split("/docs");

      this.driver.aadharphoto = "/docs" + temp[1];
    }
    if (this.common.params.driver.photo) {

      this.driverphoto = this.common.params.driver.photo;
      let temp = this.common.params.driver.photo.split("/docs");
      this.driver.driverphoto = "/docs" + temp[1];
    }
    if (this.common.params.driver.doj) {
      this.driver.date = this.common.dateFormatter1(this.common.params.driver.doj);
      console.log('date:', this.driver.date);
    }
  }

  ngOnInit() {
    this.driverForm = this.formbuilder.group({
      name: [this.common.params.driver.empname],
      mobileno: [this.common.params.driver.mobileno, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobileno2: [this.common.params.driver.mobileno2, [Validators.minLength(10), Validators.maxLength(10)]],
      guranterno: [this.common.params.driver.guarantor_mobileno],
      lisenceno: [this.common.params.driver.licence_no],
      uploadPhoto: [this.common.params.driver.photo],
      lisencephoto: [this.common.params.driver.licence_photo],
      aadharno: [this.common.params.driver.aadhar_no],
      aadharphoto: [this.common.params.driver.aadhar_photo],
      Salary: [''],
      guranter: [this.common.params.driver.guarantor_name],
      date: ['']
    });
    console.log("driverForm", this.driverForm);

    //  console.log(this.common.params.driver);
    // this.driverForm.setValue({
    //   name:"prashant";

    // }
    // )

    //   (this.common.params.driver.empname);
    // this.driverForm.controls.mobileno.value = this.common.params.driver.mobileno;
    // this.driverForm.controls.date = this.common.params.driver.doj;
    // this.driverForm.controls.guranter=this.common.params.driver.guarantor_name;
    // this.driverForm.controls.data=this.common.params.driver.guarantor_mobileno;

  }
  getDate() {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.driver.date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.driver.date);
    });
  }
  get f() { return this.driverForm.controls; }
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
        if (index == 1) {
          this.driver.lisencephoto = res;
        }
        if (index == 2) {
          this.driver.aadharphoto = res;
        }
        if (index == 3) {
          this.driver.driverphoto = res;
        }
        // this.driver.lisencephoto = { 'image'+ index: res };

        console.log('photos', this.driver.lisencephoto);
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }
  closeModal() {

    this.activeModal.close({ response: true });

  }
  Updatedriver() {



    let response;
    //this.submitted = true;
    let params = {
      name: this.driverForm.controls.name.value,
      doj: this.driver.date,
      mobileNo: this.driverForm.controls.mobileno.value,
      photo: this.driver.driverphoto,
      licenceNo: this.driverForm.controls.lisenceno.value,
      licencePhoto: this.driver.lisencephoto,
      aadharNo: this.driverForm.controls.aadharno.value,
      aadharPhoto: this.driver.aadharphoto,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
    };
    this.common.loading++;
    this.apiservice.post('/Drivers/edit', params)
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
