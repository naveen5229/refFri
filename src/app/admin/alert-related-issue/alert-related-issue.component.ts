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
  missing = 0;
  backlog = 0;
  backlogData = [];
  columns = [];
  header = [];
  header2 = [];
  columns2 =[];
  distance = 1;
  ratio = 3;
  

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal, ) {
    this.missingIndustry();
  
  }

  ngOnInit() {
  }

  missingIndustry() {

    this.header = [];
    this.columns = [];
    this.common.loading++;
    console.log("distance ",this.distance);
    let params = "?disMode="+this.distance+"&ratioMode="+this.ratio;
    this.api.get('HaltOperations/getMissingIndustries'+params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.missingIndusrtyData = res['data'];
        console.log("data:", this.missingIndusrtyData);
        if (this.missingIndusrtyData) {
          this.missing = 1;
          this.backlog = 0;
        }
        if (this.missingIndusrtyData.length) {
          for (var key in this.missingIndusrtyData[0]) {
            if (key.charAt(0) != "y_") {
              this.columns.push(key);
              key = key.replace("y_", '');
              this.header.push(key);
            }

          }
          console.log("columns:", this.columns);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  backLogs() {
    this.header2 = [];
    this.columns2 = [];
    this.common.loading++;
    this.api.get('HaltOperations/getBacklogs')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.backlogData = res['data'];
        console.log("data:", this.backlogData);
        if (this.backlogData) {
          this.backlog = 1;
          this.missing = 0;
        }
        if (this.backlogData.length) {
          for (var key in this.backlogData[0]) {
            if (key.charAt(0) != "y_") {
              this.columns2.push(key);
              key = key.replace("y_", '');
              if(key.charAt(0) != "x_")
              key = key.replace("x_", '');
              this.header2.push(key);
             

            }
            

          }
          // for (var i in this.header2){
          //   i = this.header2[i];
          //   if(i == "site_id")
          //   {
          //     console.log("hiii",i);
          //     this.header2[i].pop();

          //   }
          //   console.log("header :",this.header2);
          // }
          
              
          
          
          console.log("columns:", this.columns2);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  missingIssue(issue) {
    let ltime = new Date(issue.addtime);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);
    console.log("issue:", issue);
    let VehicleStatusData = {
      vehicle_id: issue.y_vehicle_id,
      ttime: issue.y_curr_start,
      suggest: null,
      latch_time: issue.y_outside_start,
      status:2
    }
    console.log("VehicleStatusData", VehicleStatusData);

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });

  }
  backlogsIssue(backlogsIssue) {
    let ltime = new Date(backlogsIssue.addtime);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);
    console.log("issue:", backlogsIssue);
    let VehicleStatusData = {
      vehicle_id: backlogsIssue.x_vehicle_id,
      ttime: backlogsIssue.y_sec_start_time,
      suggest: null,
      latch_time: backlogsIssue.y_start_time,
      status:3
    }
    console.log("VehicleStatusData", VehicleStatusData);

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });

  }


  formatTitle(title) {

    return title.charAt(0).toUpperCase() + title.slice(1);
  }

}
