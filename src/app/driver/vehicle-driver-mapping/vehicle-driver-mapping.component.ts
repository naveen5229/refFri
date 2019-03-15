import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverVehicleRemappingComponent } from '../../modals/driver-vehicle-remapping/driver-vehicle-remapping.component';
import { DriverStatusChangeComponent } from '../../modals/driver-status-change/driver-status-change.component';
@Component({
  selector: 'vehicle-driver-mapping',
  templateUrl: './vehicle-driver-mapping.component.html',
  styleUrls: ['./vehicle-driver-mapping.component.scss', '../../pages/pages.component.css']
})
export class VehicleDriverMappingComponent implements OnInit {
  driverMapping = [];
  driverStatus = [{
    id: null
  }];


  selectedStatus = '';

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
  ) {
    this.getdriverMapping();
    this.getdriverStatus();
    // this.getdriverSuggestion();
  }

  ngOnInit() {
  }
  getvehicleData($driverInfo) {
    console.log($driverInfo.mobileno);
    console.log($driverInfo.empname);
    console.log($driverInfo.status);
    console.log($driverInfo.refid);
  }
  getdriverMapping() {
    this.common.loading++;
    let response;
    this.api.get('/Drivers/getVehicleMapping')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverMapping = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  selectDriverStatus(status) {
    console.log("Status :", status);

  }

  getdriverStatus() {
    this.common.loading++;
    let response;
    this.api.get('Drivers/getStatus')
      .subscribe(res => {
        this.common.loading--;

        this.driverStatus = res['data'];
        console.log("Driver Status:", this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  remapDriver(driver) {
    this.common.params = { driver };
    this.modalService.open(DriverVehicleRemappingComponent, { size: 'lg', container: 'nb-layout' });
  }
  mapDriver(driver, type) {
    this.common.params = { driver, type };
    this.modalService.open(DriverStatusChangeComponent, { size: 'lg', container: 'nb-layout' });
  }

}
