import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AutoSuggestionComponent } from '../../directives/auto-suggestion/auto-suggestion.component';

@Component({
  selector: 'add-fo-admin-users',
  templateUrl: './add-fo-admin-users.component.html',
  styleUrls: ['./add-fo-admin-users.component.scss']
})
export class AddFoAdminUsersComponent implements OnInit {
  foAdminUser: FormGroup;
  submitted = false;
  Fouser = {
    name: null,
    mobileNo: null,
    Foid: null,

  };

  constructor(
    private formbuilder: FormBuilder,
    public modalService: NgbModal,
    public api: ApiService,
    public common: CommonService,


    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.foAdminUser = this.formbuilder.group({

      name: ['', [Validators.required]],
      mobileno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],

    })
  }
  get f() { return this.foAdminUser.controls; }
  closeModal() {
    this.activeModal.close();

  }


  addFoAdmin() {
    let params = {
      name: this.Fouser.name,
      mobileno: this.Fouser.mobileNo,
      foid: this.Fouser.Foid,

    };
    this.common.loading++;
    let response;
    this.api.post('FoAdmin/addUsers', params)
      .subscribe(res => {
        this.common.loading--;

        console.log('Res:', res['data']);
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  selectFoUser(value) {
    this.Fouser.Foid = value.id;
    return this.Fouser.Foid;
    console.log("", value);

  }



}
