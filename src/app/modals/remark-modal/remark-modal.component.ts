import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'remark-modal',
  templateUrl: './remark-modal.component.html',
  styleUrls: ['./remark-modal.component.scss']
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
    private activeModal: NgbActiveModal,
    public user: UserService) {
    this.title = this.common.params.title || 'Remark';
    this.placeholder = this.common.params.placeholder || 'Write your remark here...';
    this.label = this.common.params.label || 'Remark';
    this.btn1 = this.common.params.btn1 || 'Submit';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.isMandatory = this.common.params.isMandatory || true;
  }

  ngOnInit() {
  }

  closeModal(response) {
    if (this.isMandatory && !this.remark) {
      this.common.showError(this.label + ' is mandatory!');
      return;
    }
    this.activeModal.close({ remark: this.remark, response: response });
  }


}
