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
    Salary: null,
    guranter: null,
    guranterno: null,


  }

  constructor(
    private apiservice: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activeModal: NgbActiveModal) {
    console.info("driver Data:", this.common.params.driver);

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
      guranterno: [this.common.params.driver.guarantor_mobileno, [Validators.minLength(10), Validators.maxLength(10)]],
      Salary: [this.common.params.driver.salary],
      guranter: [this.common.params.driver.guarantor_name],
      date: ['']
    });
    console.log("driverForm", this.driverForm);



  }

  get f() { return this.driverForm.controls; }

  closeModal() {

    this.activeModal.close({ response: true });

  }
  Updatedriver() {
    let response;
    console.log('yash');
    let params = {
      name: this.driverForm.controls.name.value,
      doj: this.driver.date,
      mobileNo: this.driverForm.controls.mobileno.value,
      mobileNo2: this.driverForm.controls.mobileno2.value,
      salary: this.driverForm.controls.Salary.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value
    };
    console.log('hrithik');
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
