import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { DOCUMENT } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'add-fo',
  templateUrl: './add-fo.component.html',
  styleUrls: ['./add-fo.component.scss']
})
export class AddFoComponent implements OnInit {

  Form: FormGroup
  isFormSubmit = false;
  document = {
    image1: null,
    image2: null,
    image3: null,
    base64Image: null,
  }
  company = {
    mobileNo: '',
    pan: null,
    name: null,
    address: '',
    Pin_Code: '',


  }

  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) {
    // this.company.pan = this.common.params.company.pan;

  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      Mobile: ['', [Validators.required, Validators.min(10), Validators.max(10)]],
      panNo: ['', [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]],
      name: ['',],
      address: [''],
      Pin_Code: [''],
      Password: [''],
    });
  }
  get f() { return this.Form.controls; }
  handleFileSelection(event, index) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        //this.common.loading--;
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
        this.document['image' + index] = res;
        //this.compressImage(res, index);
        this.common.loading--;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  checkFormat() {
    this.company.pan = (this.company.pan).toUpperCase();

  }
  closeModal() {
    this.activeModal.close();
  }

  addFo() {

  }
  searchUser() {

  }
}
