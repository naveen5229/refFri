import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss']
})
export class ReportIssueComponent implements OnInit {
  title = 'Report Issue';
  newIssue = {
    type: '',
    remark: '',
    refId: ''
  };
  issues = [];
  submitBtn = '';
  cancelBtn = '';

  constructor(public common: CommonService, public api: ApiService,
    private activeModal: NgbActiveModal,
  ) {
    console.log("refPage", this.common.params.refPage);
    this.getIssues();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getIssues() {
    this.common.loading++;
    let params = "refPage=" + this.common.params.refPage;
    this.api.get('InformationIssue/getIssueType?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res);
        this.issues = res['data'];
      }, err => {
        console.error('Error: ', err);
        this.common.loading--;
        this.common.showError();
      });
  }

  dismiss(status?) {
    if (status && !this.newIssue.type) {
      this.common.showError('Please Select An Issue Type');
      return;
    }
    this.activeModal.close({ status: status, issue: this.newIssue });
  }

}
