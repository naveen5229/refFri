import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vehicle-trolly-mapping',
  templateUrl: './vehicle-trolly-mapping.component.html',
  styleUrls: ['./vehicle-trolly-mapping.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class VehicleTrollyMappingComponent implements OnInit {
  foName = "";
  foId = null;
  vehicleNo = "";
  vehicleId = null;
  trolleyNo = "";
  trolleyId = null;

  searchString = "";
  searchVehicleString = "";
  searchTrolleyString = "";

  showSuggestions = false;
  vehicleSuggestion = false;
  trolleySuggestion = false;
  foUsers = [];
  vehicles = [];
  trolleys = [];
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService) { }

  ngOnInit() {
  }

  selectUser(user) {
    this.foName = user.name;
    this.searchString = this.foName;
    this.foId = user.id;
    this.showSuggestions = false;
   this.resetVehDetails();

  }

  resetVehDetails()
  { 
    this.vehicleNo = "";
   this.vehicleId = null;
   this.searchVehicleString = "";
   this.trolleyNo = "";
   this.trolleyId = null;
   this.searchTrolleyString = "";
 }
  searchVehicles() {
    this.vehicleSuggestion = true;
    let params = 'search=' + this.searchVehicleString +
      '&vehicleType=truck'+
      '&foId=' + this.foId;
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
    this.searchVehicleString = this.vehicleNo + " - " + this.vehicleId;
    this.vehicleSuggestion = false;
  }
 
  searchTrolleys() {
    this.trolleySuggestion = true;
    let params = 'search=' + this.searchTrolleyString +
      '&vehicleType=trolly'+
      '&foId=' + this.foId;
    this.api.get('Suggestion/getFoVehList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.trolleys = res['data'];
        console.log("trolleys", this.trolleys);

      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectTrolleys(trolley) {
    console.log("trolleys", trolley);
    this.trolleyId = trolley.id;
    this.trolleyNo = trolley.regno;
    this.searchTrolleyString = this.trolleyNo + " - " + this.trolleyId;
    this.trolleySuggestion = false;
  }

}
