import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'remark-modal',
  templateUrl: './remark-modal.component.html',
  styleUrls: ['./remark-modal.component.scss','../../pages/pages.component.css']
})
export class RemarkModalComponent implements OnInit {
  title = '';
  remark = '';
  label = '';
  placeholder = '';
  btn1 = '';
  btn2 = '';
  isMandatory = true;

  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    public user: UserService) {
    this.title = this.common.params.title || 'Remark';
    this.placeholder = this.common.params.placeholder || 'Write your remark here...';
    this.label = this.common.params.label || 'Remark';
    this.remark = this.common.params.remark || '';
    this.btn1 = this.common.params.btn1 || 'Submit';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.isMandatory = this.common.params.isMandatory == false ? false : true;
    console.log('is Mandatory: ', this.common.params.isMandatory);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(response) {
    if (response && this.isMandatory && !this.remark) {
      this.common.showError(this.label + ' is mandatory!');
      return;
    }
    console.log("delete Reason", this.remark);
    this.activeModal.close({ remark: this.remark, response: response });
  }


}
