import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-fo-admin-users',
  templateUrl: './add-fo-admin-users.component.html',
  styleUrls: ['./add-fo-admin-users.component.scss']
})
export class AddFoAdminUsersComponent implements OnInit {
  foAdminUser: FormGroup;
  submitted = false;
  constructor(
    private formbuilder: FormBuilder,
    public modalService: NgbModal,


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

}
