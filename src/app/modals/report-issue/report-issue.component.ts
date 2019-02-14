import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(public common: CommonService, public api: ApiService,
    private activeModal: NgbActiveModal,
  ) {
    this.getIssues();
  }

  ngOnInit() {
  }

  getIssues() {
    this.common.loading++;
    this.api.get('InformationIssue/getIssueType')
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
    if(status && !this.newIssue.type){
      this.common.showError('Please Select An Issue Type');
      return;
    }
    this.activeModal.close({status: status, issue: this.newIssue});
  }

}
