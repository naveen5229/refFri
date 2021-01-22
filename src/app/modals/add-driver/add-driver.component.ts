import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  };
  show: boolean = false;
  detailsBtn: any = 'More Details';


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formbuilder: FormBuilder, ) { }

  ngOnDestroy(){}
ngOnInit() {
    this.driverForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]],
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

  closeModal() {
    this.driverForm.controls = null;
    this.activeModal.close();
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

  get f() { return this.driverForm.controls; }

  addNewdriver() {
    console.log('addNewdriver call')
    let response;
    //this.submitted = true;
    let params = {
      name: this.driverForm.controls.name.value,
      mobileNo: this.driverForm.controls.mobileno.value,
      photo: this.driverForm.controls.uploadPhoto.value,
      lisenceno: this.driverForm.controls.lisenceno.value,
      licencePhoto: this.driverForm.controls.lisencephoto.value,
      aadharNo: this.driverForm.controls.aadharno.value,
      aadharPhoto: this.driverForm.controls.aadharphoto.value,
      guarantorName: this.driverForm.controls.guranter.value,
      guarantorMobile: this.driverForm.controls.guranterno.value,
    };
    this.common.loading++;
    this.api.post('Drivers/add', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.common.showToast(res['msg']);
        this.activeModal.close();

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }

  getDate() {

    this.common.params = { ref_page: 'generate-lr' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.driver.doj = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        // this.dateByIcon=true;
        console.log('DOJ: by getDate ' + this.driver.doj);

      }

    });
  }

  toggle() {
    this.show = !this.show;
    console.log(this.show);
    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.detailsBtn = "Hide";
    else
      this.detailsBtn = "More Details";
  }


}
