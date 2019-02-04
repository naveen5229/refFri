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

  date = this.common.dateFormatter(new Date());
  details = "";
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
    this.getCurrentTrolleyDetails();
  }

  getCurrentTrolleyDetails(){
    console.log("vehicleId", this.vehicleId);
    let params = 'vehicleId=' + this.vehicleId +
      '&refMode=701';
    this.api.get('Tyres/getCurrentTrolleyDetails?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        let currentTrolley = res['data'];
        console.log("Trolley details", currentTrolley);

      }, err => {
        console.error(err);
        this.common.showError();
      });
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


  saveMappingDetails() {
    this.common.loading++;
    let params = {
      vehicleId : this.vehicleId,
      refMode : 701,
      date : this.date,
      details : this.details,
      trollyId :this.trolleyId
    };
    console.log('Params:', params);
    this.api.post('Tyres/saveVehicleTrollyMapping', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id ", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          console.log("sucess");
          this.common.showToast("sucess");
        } else {
          console.log("fail");
          this.common.showToast(res['data'][0].rtn_msg);
        }
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }
}
