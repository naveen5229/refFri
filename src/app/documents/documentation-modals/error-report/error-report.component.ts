import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'error-report',
  templateUrl: './error-report.component.html',
  styleUrls: ['./error-report.component.scss']
})
export class ErrorReportComponent implements OnInit {
  title = '';
  btn = '';
  errors = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.title =this.common.params.title;
      this.btn = this.common.params.btn || 'Close';
      this.errors = this.common.params.errorData;
      console.log("error data",this.errors);
     }

  ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
}
