import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { ResolveMissingIndustryComponent } from '../../modals/resolve-missing-industry/resolve-missing-industry.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'alert-related-issue',
  templateUrl: './alert-related-issue.component.html',
  styleUrls: ['./alert-related-issue.component.scss', '../../pages/pages.component.css']
})
export class AlertRelatedIssueComponent implements OnInit {
  missingIndusrtyData = [];
  ticketsData = [];
  missing = 0;
  backlog = 0;
  tickets = 1;
  // backlogData = [];
  // columns = [];
  // header = [];
  // header2 = [];
  // columns2 = [];
  // distance = 1;
  // ratio = 3;


  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal, ) {
    this.common.refresh = this.refresh.bind(this);
      this.ticket();
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.ticket();
  }

  ticket() {
    this.common.loading++;
    this.api.get('MissingIndustry')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.ticketsData = res['data'];
        console.log("data:", this.ticketsData);
        if (this.ticketsData) {
          this.tickets = 1;
          this.backlog = 0;
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }
  enterTicket(issue) {
    let result;
    let params = {
      tblRefId: 7,
      tblRowId: issue.vehicle_id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/insertTicketActivity', params)
      .subscribe(res => {
        this.common.loading--;
        result = res;
        console.log(result);
        if (!result['success']) {
          // alert(result.msg);
          this.common.showToast(res['msg']);
          return false;
        }
        else {
          this.openChangeStatusModal(issue);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


 

  openChangeStatusModal(issue) {

    let ltime = new Date(issue.addtime);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);

    let VehicleStatusData = {
      id: issue.id,
      vehicle_id: issue.vehicle_id,
      tTime: issue.ttime,
      suggest: null,
      latch_time: issue.ltime,
      status: 2,
      remark: issue.remark
    }
    console.log("missing open data ", VehicleStatusData);
    this.common.ref_page  = 'ari';

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log("after data chnage ");
      this.ticket();

      this.exitTicket(VehicleStatusData);
    });

  }
  exitTicket(missingIssue) {
    let result;
    var params = {
      tblRefId: 7,
      tblRowId: missingIssue.vehicle_id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        this.common.loading--;
        result = res
        console.log(result);
        if (!result.sucess) {
          //  alert(result.msg);
          return false;
        }
        else {
          return true;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  // backlogsIssue(backlogsIssue) {
  //   let ltime = new Date(backlogsIssue.addtime);
  //   let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
  //   let latch_time = this.common.dateFormatter(subtractLTime);
  //   console.log("issue:", backlogsIssue);
  //   let VehicleStatusData = {
  //     vehicle_id: backlogsIssue.x_vehicle_id,
  //     ttime: backlogsIssue.y_sec_start_time,
  //     suggest: null,
  //     latch_time: backlogsIssue.y_start_time,
  //     status: 3
  //   }
  //   console.log("VehicleStatusData", VehicleStatusData);

  //   this.common.params = VehicleStatusData;
  //   const activeModal = this.modalService.open(ResolveMissingIndustryComponent, { size: 'lg', container: 'nb-layout' });
  //   activeModal.result.then(data => {
  //   });

  // }


  // formatTitle(title) {
  //   return title.charAt(0).toUpperCase() + title.slice(1);
  // }

}
