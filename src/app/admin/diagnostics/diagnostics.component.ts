import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { VechileTrailsComponent } from '../../modals/vechile-trails/vechile-trails.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { VehicleAnalysisComponent } from '../../modals/vehicle-analysis/vehicle-analysis.component';

@Component({
  selector: 'diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss', '../../pages/pages.component.css']
})
export class DiagnosticsComponent implements OnInit {
  Distance = null;
  listtype = "";
  diagnostics = {
    vechileno: null,
    endDate: this.common.dateFormatter(new Date()),
    startTime: this.common.dateFormatter(new Date()),

  };
  selectedVehicleId = null;
  Trails = {
    vechileno: null,
    startTime: this.common.dateFormatter(new Date()),
    endDate: this.common.dateFormatter(new Date()),
  };
  VehicleStatusData = {
    vehicle_id: null,
    latch_time: null,
    //ttime:null

  }

  constructor(
    public router: Router,
    private modalservice: NgbModal,
    public common: CommonService,
    public api: ApiService) {
    // this.getvehicleData(this.diagnostics.vechileno);
    // this.getDistance();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {

  }

  refresh(){
    console.log('Refresh');
  }

  getDate(time) {
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.diagnostics[time] = this.common.dateFormatter(data.time).split(' ')[0];
      console.log('Date:', this.diagnostics[time]);
    });

  }
  calculateDistance() {

    let params = {
      vehicleId: this.selectedVehicleId,
      fromTime: this.common.dateFormatter(this.diagnostics.startTime),
      tTime: this.common.dateFormatter(this.diagnostics.endDate)
    };
    console.log("params :", params);
    this.common.loading++;
    this.api.post('Vehicles/getVehDistanceBwTime', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.Distance = res['data'] ? parseInt('' + (res['data'] / 1000)) + " KM" : "Not Available";
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  getvehicleData(vehicle, type) {
    console.log('Vehicle Data:+++++ ', vehicle, type);

    if (type == 'trails') {
      this.Trails.vechileno = vehicle.id;
    } if (type == 'distance') {
      this.diagnostics.vechileno = vehicle.regno;
    } if (type == 'Status') {
      this.VehicleStatusData.vehicle_id = vehicle.id;
    }
  }
  getVehicleTrails() {
    let param = {
      vehicleId: this.selectedVehicleId,
      fromTime: this.common.dateFormatter(this.Trails.startTime),
      toTime: this.common.dateFormatter(this.Trails.endDate),
      suggestId: 1,
      status: 0
    }
    console.log("param", param);
    this.common.loading++;
    this.api.post('VehicleStatusChange/getVehicleTrail', param)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'].length > 0) {
          this.common.params = res['data'];
          console.log('res: ', this.common.params);
          this.modalservice.open(VechileTrailsComponent, { size: 'lg', container: 'nb-layout' });
        } else {
          alert("Vehicle Trails are not present for this time period");
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  getChangeVehicleStatusChange() {
    let params = {
      vehicleId: this.selectedVehicleId,
      fromTime: this.VehicleStatusData.latch_time,
      //toTime: this.VehicleStatusData.ttime,
      suggestId: 1
    }
    console.log("param", params);
    this.common.loading++;
    this.api.post('VehicleStatusChange/getVehicleTrail', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'].length > 0) {
          this.common.params = res['data'];
          console.log('res: ', this.common.params);
          this.modalservice.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
        } else {
          alert("Vehicle Trails are not present for this time period");
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  selectVehicle(vehicle) {
    console.log('Vehicle Data:+++ ', this.selectedVehicleId);
    this.selectedVehicleId = vehicle.id;
    console.log("vehicle=", vehicle);



  }
  topRecord() {
    console.log("type :", this.listtype);
    console.log('Vehicle Data: ', this.selectedVehicleId);
    let params = {
      vehicleId: this.selectedVehicleId,
      tableName: this.listtype
    };
    console.log("params :", params);
    this.common.loading++;
    this.api.post('MasterDetails/getDataAccordingVehicle', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        if (res['data'].length > 0) {
          this.common.params = res['data'];
          console.log('res: ', this.common.params);
          this.modalservice.open(VehicleAnalysisComponent, { size: 'lg', container: 'nb-layout' });
        } else {
          alert("No Vehicle Data are  Available ");
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }
  vehicleRecord() {

  }

  ChangeVehicleStatusChange() {

  }


}


