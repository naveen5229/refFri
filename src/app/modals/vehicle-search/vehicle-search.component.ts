import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'vehicle-search',
  templateUrl: './vehicle-search.component.html',
  styleUrls: ['./vehicle-search.component.scss','../../pages/pages.component.css']
})
export class VehicleSearchComponent implements OnInit {
  vehicleId = null;
  vehicleRegNo = null; 
  searchVehicleString = "";
  vehicleSuggestion = false;
  vehicleType = "truck";
  refMode = 701
  vehicles = [];
  constructor(
    private activeModal: NgbActiveModal,
    private common : CommonService,
    public api : ApiService
  ) {
    this.vehicleId = this.common.params.vehicleId;
    this.vehicleRegNo = this.common.params,this.vehicleRegNo;
    console.log(this.vehicleId,this.vehicleRegNo)
   }

  ngOnInit() {
  }

  selectedVehicle(vehicle){
    this.vehicleId = vehicle.id;
    this.vehicleRegNo = vehicle.regno;
   
  }
  
  closeModal() {
    
    let response ={
      vehicleId : this.vehicleId,
      vehicleRegNo : this.vehicleRegNo,
      refMode : this.refMode
    }
    this.activeModal.close(this.activeModal.close({ response: response }));
  }

  resetVehDetails()
  { 
    if(this.vehicleType == "truck"){
      this.refMode = 701;
    }else if(this.vehicleType == "warehouse"){
      this.refMode = 703;
    }else {
      this.refMode = 702;
    }
    this.vehicleRegNo = "";
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
     console.log("vehicle",vehicle );
     this.vehicleId = vehicle.id;
     this.vehicleRegNo = vehicle.regno;
     this.searchVehicleString = this.vehicleRegNo;
     this.vehicleSuggestion = false;
   }
 

dismissModal() {
  this.activeModal.close();

}
}
