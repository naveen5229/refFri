import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'alert-related-issue',
  templateUrl: './alert-related-issue.component.html',
  styleUrls: ['./alert-related-issue.component.scss', '../../pages/pages.component.css']
})
export class AlertRelatedIssueComponent implements OnInit {
  missingIndusrtyData = [];
  backlogData = [];
  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal, ) { }

  ngOnInit() {
  }

  missingIndustry() {
    this.common.loading++;
    this.api.get('HaltOperations/getMissingIndustries')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.missingIndusrtyData = res['data'];
        console.log("data:", this.missingIndusrtyData);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  backLogs(){
 this.common.loading++;
    this.api.get('HaltOperations/getBacklogs')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.backlogData = res['data'];
        console.log("data:", this.backlogData);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
