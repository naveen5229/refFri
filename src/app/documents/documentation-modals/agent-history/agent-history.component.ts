import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'agent-history',
  templateUrl: './agent-history.component.html',
  styleUrls: ['./agent-history.component.scss','../../../pages/pages.component.css']
})
export class AgentHistoryComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  datas = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.title = this.common.params.title;
      this.datas = this.common.params.data;
      this.btn1 = this.common.params.btn1 || 'Confirm';
    this.btn2 = this.common.params.btn2 || 'Cancel';
     }

  ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }

}
