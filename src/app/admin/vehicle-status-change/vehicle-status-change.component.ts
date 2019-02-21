import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vehicle-status-change',
  templateUrl: './vehicle-status-change.component.html',
  styleUrls: ['./vehicle-status-change.component.scss', '../../pages/pages.component.css']
})
export class VehicleStatusChangeComponent implements OnInit {
  viewType = "all";
  VehicleStatusAlerts = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
  ) {

    this.getVehicleStatusAlerts(this.viewType);

  }

  ngOnInit() {
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

  getPendingStatusDetails() {
    this.common.loading++;
    this.api.get('HaltOperations/getPendingAlertDetails?')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        let data = [];
        res['data'].map((pendingAlert, index) => {
          data.push([index, pendingAlert.name, pendingAlert.cnt, pendingAlert.actct, pendingAlert.wuct, this.common.changeDateformat(pendingAlert.time)]);
        });
        console.log(data);
        this.common.params = { title: 'Pending Alert Details:', headings: ["#", "Activity Name", "Count", "Since Updated (In Minutes)", "Working User (In Last 10 Minutes)", "Clear Tickets (In Last 10 Minutes)"], data };
        this.modalService.open(ViewListComponent, { size: 'md', container: 'nb-layout' });
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

  openChangeStatusModal(VehicleStatusData) {
    console.log("VehicleStatusData", VehicleStatusData);
    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log("data", data.respone);
      this.getVehicleStatusAlerts(this.viewType);

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
        result = res
        console.log(result);
        if (!result['success']) {
          alert(result.msg);
          return false;
        }
        else {
          this.openChangeStatusModal(VehicleStatusData);
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
          alert(result.msg);
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
}
