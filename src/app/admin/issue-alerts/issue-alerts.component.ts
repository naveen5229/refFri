import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';

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
    public modalService:NgbModal

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

  goToTrail(issue){
    let ltime =  new Date(issue.addtime);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);
    let VehicleStatusData = {
      vehicle_id : issue.referid,
      ttime:issue.addtime,
      suggest:11,
      latch_time:latch_time
    }
    console.log("VehicleStatusData", VehicleStatusData);
   
    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
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
