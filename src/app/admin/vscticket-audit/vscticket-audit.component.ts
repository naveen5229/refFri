import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';

@Component({
  selector: 'vscticket-audit',
  templateUrl: './vscticket-audit.component.html',
  styleUrls: ['./vscticket-audit.component.scss']
})
export class VSCTicketAuditComponent implements OnInit {

  startDate = new Date();
  element = '';
  endDate = new Date();
  reportUserWise = [];
  reportVehicleWise = [];

  vehicleId = null;
  adminId = null;
  ticketAccordingTo = 'vehicle';
  aduserId = null;
  VehicleStatusAlerts = [];
  aduserIds = [];
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.getAduserIds();
  }

  ngOnInit() {
  }

  searchVehicle(vehicle) {
    this.vehicleId = vehicle.id;
  }

  searchUser(admin) {
    this.adminId = admin.id;
  }

  getVehicleStatusAlerts() {
    let params = 'aduserId=' + this.aduserId;
    console.log("params ", params);
    this.api.get('HaltOperations/getVehicleStatusAduserViseAlerts?' + params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.VehicleStatusAlerts = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
  getAduserIds() {
    this.api.get('HaltOperations/getAutoAduserid')
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.aduserIds = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  openVSCModel(data) {

    let index = this.VehicleStatusAlerts.findIndex(element => {
      return element.vehicle_id == data.vehicle_id;
    });
    this.VehicleStatusAlerts[index].isHighlight = true;
    let VehicleStatusData = {
      vehicle_id: data.vehicle_id,
      tTime: data.ttime,
      suggest: 11,
      latch_time: data.latch_time
    }
    console.log("VehicleStatusData", VehicleStatusData);

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });
  }

  goToTrail() {
    let VehicleStatusData = {
      vehicle_id: this.vehicleId,
      tTime: this.common.dateFormatter(this.endDate),
      suggest: 11,
      latch_time: this.common.dateFormatter(this.startDate)
    }
    console.log("VehicleStatusData", VehicleStatusData);

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });
  }

  getChallenged() {
    let params = {
      startTime: this.common.dateFormatter(this.startDate),
      endTime: this.common.dateFormatter(this.endDate),
      aduserId: this.aduserId
    };
    this.api.post('HaltOperations/getChallenged', params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.VehicleStatusAlerts = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
}
