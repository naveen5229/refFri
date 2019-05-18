import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { DOCUMENT } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'add-fo',
  templateUrl: './add-fo.component.html',
  styleUrls: ['./add-fo.component.scss']
})
export class AddFoComponent implements OnInit {
  isFormSubmit = false;
  show_dialog: boolean = false;
  public button_name: any = 'Show Login Form!';
  document = {
    image1: null,
    image2: null,
    image3: null,
    base64Image: null,
  }
  company = {
    mobileNo: '',
    pan: '',
    name: '',
    address: '',
    pincode: '',
    password: '',
    partner: '',
    searchMN: '',
  }

  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService

  ) {
    // this.company.pan = this.common.params.company.pan;

  }

  ngOnInit() {
  }
  toggle() {
    this.show_dialog = !this.show_dialog;

    // CHANGE THE TEXT OF THE BUTTON.
    if (this.show_dialog)
      this.button_name = "Hide Login Form!";
    else
      this.button_name = "Show Login Form!";
  }


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
  addfo() {
    //console.log("hiiiiiiiiii", form);

    let params = {
      name: this.company.name,
      mobileNo: this.company.mobileNo,
      address: this.company.address,
      pinCode: this.company.pincode,
      passWord: this.company.password,
      idProof: this.document.image1,
      addProofFront: this.document.image2,
      addProofBack: this.document.image3,
      panCard: this.company.pan,
      partner: this.company.partner,
      search: this.company.searchMN,
    };
    console.log('Params:', params);
    // if (params) return;
    this.common.loading++;

    this.api.post('Gisdb/addFo', params)
      .subscribe(res => {
        this.common.loading--;

        console.log('Res:', res['data']);
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }




  checkFormat() {
    this.company.pan = (this.company.pan).toUpperCase();

  }
  selectPartner(e) {
    // console.log('', e)
    this.company.partner = e.id;

  }
  closeModal() {
    this.activeModal.close();
  }
}
