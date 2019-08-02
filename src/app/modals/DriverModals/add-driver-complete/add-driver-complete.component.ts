import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/user.service';
import { UploadDocsComponent } from '../../upload-docs/upload-docs.component';

@Component({
  selector: 'add-driver-complete',
  templateUrl: './add-driver-complete.component.html',
  styleUrls: ['./add-driver-complete.component.scss']
})
export class AddDriverCompleteComponent implements OnInit {
  driverForm: FormGroup;
  submitted = false;
  driver = {
    name: null,
    mobileno: null,
    mobileno2: null,

    lisenceNumber: null,

    adharNumber: null,

    salary: null,
    guranter: null,
    guranterMobileNo: null,
    doj: this.common.dateFormatter1(new Date()),
  };
  addDriverRes = [];
  constructor(public common: CommonService,
    public modalService: NgbModal,
    private formbuilder: FormBuilder,
    public api: ApiService,
    public user: UserService,
    public activeModal: NgbActiveModal) {
    console.log('Driver: ', this.common.params);

  }

  ngOnInit() {
    this.driverForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      mobileno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobileno2: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      guranterno: [''],
      lisenceno: [''],
      aadharno: [''],
      Salary: [''],
      guranter: [''],
      dateofJoin: ['']
    })
  }
  closeModal() {
    this.driverForm.controls = null;

    this.activeModal.close({ response: true });

  }
  get f() { return this.driverForm.controls; }

  getDate() {
    this.common.params = { ref_page: 'add-driver' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.driver.doj = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.driver.doj);
    });
  }

  addNewdriver() {
    const params = {
      name: this.driverForm.controls.name.value,
      mobileNo: this.driverForm.controls.mobileno.value,
      mobileNo2: this.driverForm.controls.mobileno2.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
      doj: this.driver.doj,
      salary: this.driverForm.controls.Salary.value,
    };
    this.common.loading++;
    this.api.post('/Drivers/add', params)
      .subscribe(res => {
        this.common.loading--;
        this.addDriverRes = res['data']
        console.log('Res:', res['data']);

        if (this.addDriverRes[0]) {

          //  const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

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
