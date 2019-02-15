import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class InputsComponent implements OnInit {

  vehicleType = "truck";
  refMode = 701;
  vehicleNo = "";
  vehicleId = null;
  tyreId = null;
  tyreNo = "";

  searchString = "";
  searchVehicleString = "";
  searchTyreString = "";

  showSuggestions = false;
  vehicleSuggestion = false;
  tyreSuggestion = false;

  foUsers = [];
  vehicles = [];
  tyres = [];

  tyrePosition = null

  searchedTyreDetails = [];
  axels = [];
  position = null;
  details :null;

  vehicleTyrePosition = [{
    truck:{
      axel:{
      l1:'',
      l2:'',
      r1:'',
      r2:'',
      pos:''
    },
    
  }
  }]

  date1 = this.common.dateFormatter(new Date());

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
  ) { 
    this.axels = this.common.generateArray(6)
  }

  ngOnInit() {
  }

  
 
  resetVehDetails()
 { 
   this.vehicleNo = "";
  this.vehicleId = null;
  this.tyreId = null;
  this.tyreNo = "";
  this.searchVehicleString = "";
  this.searchTyreString = "";
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
    this.vehicleNo = vehicle.regno;
    this.searchVehicleString = this.vehicleNo;
    this.vehicleSuggestion = false;
    this.searchData();
  }

  searchTyres() {
    this.tyreSuggestion = true;
    let params = 'search=' + this.searchTyreString ;
    this.api.get('Tyres/getTyreNumbersAccordingFO?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.tyres = res['data'];
        console.log("tyres", this.tyres);

      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
  selectTyres(tyre) {
    console.log("tyre",tyre);
    this.tyreId = tyre.id;
    this.tyreNo = tyre.tyrenum;
    this.searchTyreString = this.tyreNo;
    console.log("searchTyreString",this.searchTyreString);
    this.tyreSuggestion = false;

  }


  // getDate(date) {
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.date = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.date);
  //   });
  // }

  searchData() {
      if(this.vehicleType == "trolly"){
        this.refMode = 702;
      }else if(this.vehicleType == "truck"){
        this.refMode = 701;
      }else if(this.vehicleType == "warehouse"){
        this.refMode = 703;
      }else{
        
      }
      let params = 'vehicleId=' +this.vehicleId+
      '&refMode=' + this.refMode;
      console.log("params ", params);
      this.api.get('Tyres/getVehicleTyrePosition?' + params)
        .subscribe(res => {
          this.searchedTyreDetails = res['data'];
          console.log("searchedTyreDetails", this.searchedTyreDetails);

        }, err => {
          console.error(err);
          this.common.showError();
        });
    
  }

getTyrePosition(tyrePosition){
  this.position = tyrePosition;
  console.log("tyre position = ",tyrePosition);
}

  saveDetails() {
    let date= this.common.dateFormatter(new Date(this.date1));
    if(this.vehicleType == "trolly"){
      this.refMode = 702;
    }else if(this.vehicleType == "truck"){
      this.refMode = 701;
    }else {
      this.refMode = 703;
    }
    this.common.loading++;
    let params = {
      vehicleId : this.vehicleId,
      date : date,
      tyreId : this.tyreId,
      tyrePos : this.position,
      details : this.details,
      refMode : this.refMode
    };
    console.log('Params:', params);

    this.api.post('Tyres/saveTyreInputs', params)
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
        this.searchData() ;
        
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }
  
}


