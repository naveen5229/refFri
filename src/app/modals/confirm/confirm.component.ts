import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss','../../pages/pages.component.css']
})
export class ConfirmComponent implements OnInit {
  title = '';
  description = '';
  btn1 = '';
  btn2 = '';


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.description = this.common.params.description || 'Are you sure?';
    this.btn1 = this.common.params.btn1 || 'Confirm';
    this.btn2 = this.common.params.btn2 || 'Cancel';
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  
  closeModal(response,apiHit) {
    this.activeModal.close({ response: response,apiHit:apiHit });
  }

}
