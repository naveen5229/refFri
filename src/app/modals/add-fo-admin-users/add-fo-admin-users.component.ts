import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AutoSuggestionComponent } from '../../directives/auto-suggestion/auto-suggestion.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-fo-admin-users',
  templateUrl: './add-fo-admin-users.component.html',
  styleUrls: ['./add-fo-admin-users.component.scss']
})
export class AddFoAdminUsersComponent implements OnInit {
  btn='Add';
  data = [];
  loginType = '';
  authType = '1';
  foAdminUser: FormGroup;
  submitted = false;
  Fouser = {
    foAdminName: null,
    name: null,
    mobileNo: null,
    Foid: null,
    foaid:null
  };
  foadminusrId = null;

  constructor(
    private formbuilder: FormBuilder,
    public modalService: NgbModal,
    public api: ApiService,
    public common: CommonService,


    public activeModal: NgbActiveModal,
  ) { this.displayLoginType()}

  ngOnDestroy(){}
ngOnInit() {
    this.foAdminUser = this.formbuilder.group({

      name: ['', [Validators.required]],
      mobileno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      authType:[''],
      loginType:['']
    })
  }
  get f() { return this.foAdminUser.controls; }
  closeModal() {
    this.activeModal.close();

  }

  displayLoginType() {
    if (this.authType == '1') {
      this.data = [
        { id: 1, name: 'Otp' },
        { id: 2, name: 'QR Code' }
      ]
    }
  }


  addFoAdmin() {
    let params = {};
    params = {
      name: this.Fouser.name,
      mobileno: this.Fouser.mobileNo,
      foid: this.Fouser.Foid,
      authType: this.authType,
      loginType: this.loginType,
      rowId: this.Fouser.foaid
    };
    this.common.loading++;
    let response;
    this.api.post('FoAdmin/addUsers', params)
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
  selectFoUser(value) {
    console.log("--------", value);
    if (value.foaid != '' || value.foaid != null) {
      this.btn='Update';
      this.Fouser.Foid = value.foid;
      this.Fouser.mobileNo = value.foamobileno;
      this.Fouser.name = value.foaname;
      this.Fouser.foAdminName = value.foname;
      this.Fouser.foaid=value.foaid;
      this.authType=value.auth_type;
      this.loginType=value.login_type;
    }
  }

  selectFoUserList(value) {
    this.Fouser.Foid = value.id;
  }



}
