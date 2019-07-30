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
      guranterno: [this.common.params.driver.guarantor_mobileno],
      Salary: [this.common.params.driver.salary],
      guranter: [this.common.params.driver.guarantor_name],
      date: ['']
    });
    console.log("driverForm", this.driverForm);



  }
  getDate() {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.driver.date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.driver.date);
    });
  }
  get f() { return this.driverForm.controls; }

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
      salary: this.driverForm.controls.Salary.value,
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
