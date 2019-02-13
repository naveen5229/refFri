import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'vehicle-tyre-position-master',
  templateUrl: './vehicle-tyre-position-master.component.html',
  styleUrls: ['./vehicle-tyre-position-master.component.scss','../../pages/pages.component.css', '../tyres.component.css']
})
export class VehicleTyrePositionMasterComponent implements OnInit {
  vehicleType = "truck";
  refMode = 701;

  vehicleNo = "";
  vehicleId = null;
  
  searchVehicleString = "";
  vehicleSuggestion = false;
  vehicles = [];

  vehicleDetails = [
    {
      left_1:null,
      left_2:null,
      right_1:null,
      right_2:null,
      axelNo:1
    }
  ];
  constructor(
    public common: CommonService,
    public api: ApiService
  ) { 
    
  }

  ngOnInit() {
  }

  resetVehDetails()
  { 
    this.vehicleNo = "";
   this.vehicleId = null;
   this.searchVehicleString = "";
}

searchVehicles() {
  this.vehicleSuggestion = true;
  let params = 'search=' + this.searchVehicleString +
    '&vehicleType=' +this.vehicleType;
  this.api.get('Suggestion/getFoVehList?' + params) // Customer API
    // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
    .subscribe(res => {
      this.vehicles = res['data'];
      console.log("Vehicles", this.vehicles);

    }, err => {
      console.error(err);
      this.common.showError();
    });
}

selectVehicle(vehicle) {
  console.log("vehicle", vehicle);
  this.vehicleId = vehicle.id;
  this.vehicleNo = vehicle.regno;
  this.searchVehicleString = this.vehicleNo ;
  this.vehicleSuggestion = false;
  this.getVehicleTyreData();
}

getVehicleTyreData() {
  if(this.vehicleType == "trolly"){
    this.refMode = 702;
  }else{
    this.refMode = 701;
  }
  let params = 'vehicleId=' +this.vehicleId+
  '&refMode=' + this.refMode;
  console.log("params ", params);
  this.api.get('Tyres/getVehicleTyreDetials?' + params)
    .subscribe(res => {
      this.vehicleDetails = res['data'];

    }, err => {
      console.error(err);
      this.common.showError();
    });

}
}