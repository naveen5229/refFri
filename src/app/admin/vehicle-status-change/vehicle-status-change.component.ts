import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpDashboardComponent } from '../../documents/documentation-modals/emp-dashboard/emp-dashboard.component';
import { ChangeVehicleStatusByCustomerComponent } from '../../modals/change-vehicle-status-by-customer/change-vehicle-status-by-customer.component';
import { UserService } from '../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { VerifyHaltsComponent } from '../../modals/verify-halts/verify-halts.component';

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-status-change',
  templateUrl: './vehicle-status-change.component.html',
  styleUrls: ['./vehicle-status-change.component.scss', '../../pages/pages.component.css']
})
export class VehicleStatusChangeComponent implements OnInit {
  viewType = "all";
  dis = "old";
  VehicleStatusAlerts = [];
  status = {
    1: 'Accept',
    0: 'Pending',
    '-1': 'Advance Review'
  }
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService 
  ) {

    this.getVehicleStatusAlerts(this.viewType);
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getVehicleStatusAlerts(this.viewType);
  }

  getVehicleStatusAlerts(viewType) {
    this.viewType = viewType;
    let params = 'viewType=' + this.viewType;
    console.log("params ", params);
    this.api.get('HaltOperations/getVehicleStatusAlerts?' + params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.VehicleStatusAlerts = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  getHaltsDetails() {
    const activeModal = this.modalService.open(VerifyHaltsComponent, { size: 'lg', container: 'nb-layout' });
  }

  getPendingStatusDetails() {
    this.common.loading++;
    this.api.get('HaltOperations/getPendingAlertDetails?')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        let data = [];
        res['data'].map((pendingAlert, index) => {
          data.push([index, pendingAlert.alertname, pendingAlert.cnt, pendingAlert.actct, pendingAlert.wuct, this.common.changeDateformat(pendingAlert.time)]);
        });
        console.log(data);
        this.common.params = { title: 'Pending Alert Details:', headings: ["#", "Activity Name", "Count", "Since Updated (In Minutes)", "Working User (In Last 10 Minutes)", "Clear Tickets (In Last 10 Minutes)"], data };
        this.modalService.open(ViewListComponent, { size: 'lg', container: 'nb-layout' });
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

  openChangeStatusModal(VehicleStatusData) {
    console.log("VehicleStatusData", VehicleStatusData);
    this.common.params = VehicleStatusData;
    this.common.ref_page = 'vsc';
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
      // this.getVehicleStatusAlerts(this.viewType);

      this.exitTicket(VehicleStatusData);
    });
  }

  openChangeStatusCustomerModal(VehicleStatusData) {
    console.log("VehicleStatusData", VehicleStatusData);
    this.common.params = VehicleStatusData;
    this.common.ref_page = 'vsc';
    const activeModal = this.modalService.open(ChangeVehicleStatusByCustomerComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);
      // this.getVehicleStatusAlerts(this.viewType);

      this.exitTicket(VehicleStatusData);
    });
  }

  enterTicket(VehicleStatusData) {
    let result;
    let params = {
      tblRefId: 1,
      tblRowId: VehicleStatusData.vehicle_id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/insertTicketActivity', params)
      .subscribe(res => {
        this.common.loading--;
        result = res;
        console.log(result);
        if (!result['success']) {
          //alert(result.msg);
          return false;
        }
        else {
          if (this.user._loggedInBy == "admin") {
             this.openChangeStatusModal(VehicleStatusData);
          }
          else {
            this.openChangeStatusCustomerModal(VehicleStatusData);
          }
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }
  exitTicket(VehicleStatusData) {
    let result;
    var params = {
      tblRefId: 1,
      tblRowId: VehicleStatusData.vehicle_id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        this.common.loading--;
        result = res
        console.log(result);
        if (!result.sucess) {
          // alert(result.msg);
          this.getVehicleStatusAlerts(this.viewType);
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

  openAnalyticsModal() {
    this.common.params = { title: 'Analytics' };
    const activeModal = this.modalService.open(EmpDashboardComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {

    });
  }
}
