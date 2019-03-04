import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'issue-alerts',
  templateUrl: './issue-alerts.component.html',
  styleUrls: ['./issue-alerts.component.scss','../../pages/pages.component.css']
})
export class IssueAlertsComponent implements OnInit {
issues=[];
  constructor(
    public api:ApiService,
    public common:CommonService,

  ) { 
    this.getIssueAlerts();
  }

  ngOnInit() {
  }

  getIssueAlerts() {
    this.api.get('IssueDetection/getIssueAlerts?')
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.issues = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  issueComplete(issue) {
    console.log("issue",issue);
    this.common.loading++;
    let params = {
      alertId: issue.id,
      status: 1
    };
    console.log(params);
    this.api.post('IssueDetection/issueStatusUpdate?', params)
      .subscribe(res => {
        this.common.loading--;
        this.getIssueAlerts();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


}
