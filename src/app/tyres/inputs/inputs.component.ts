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

  foName = "";
  foId = null;
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

  searchedTyreDetails = [];

  position={
    frontRear : null,
    axel : null,
    leftRight : null,
    pos:null
  };
  details :null;

  date1 = this.common.dateFormatter(new Date());

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
  ) { }

  ngOnInit() {
  }

  searchUser() {
    console.log("test");
    this.showSuggestions = true;
    let params = 'search=' + this.searchString;
    this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.foUsers = res['data'];
        console.log("suggestions", this.foUsers);

      }, err => {
        console.error(err);
        this.common.showError();
      });
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
  this.tyreId = null;
  this.tyreNo = "";
  this.searchVehicleString = "";
  this.searchTyreString = "";
}
  searchVehicles() {
    this.vehicleSuggestion = true;
    let params = 'search=' + this.searchVehicleString +
      '&foId=' + this.foId+
      '&vehicleType=' +this.vehicleType;
      console
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
    this.searchVehicleString = this.vehicleNo+" - "+this.vehicleId;
    this.vehicleSuggestion = false;
  }

  searchTyres() {
    this.tyreSuggestion = true;
    let params = 'search=' + this.searchTyreString +
      '&foId=' + this.foId;
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
    this.searchTyreString = this.tyreNo+" - "+this.tyreId;
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
    if (this.foId) {
      if(this.vehicleType == "trolly"){
        this.refMode = 702;
      }else{
        this.refMode = 701;
      }
      let params = 'foId=' + this.foId+
      '&vehicleId=' +this.vehicleId+
      '&refMode=' + this.refMode;
      console.log("params ", params);
      this.api.get('Tyres/getVehicleTyreDetails?' + params)
        .subscribe(res => {
          this.searchedTyreDetails = res['data'];
          console.log("searchedTyreDetails", this.searchedTyreDetails);

        }, err => {
          console.error(err);
          this.common.showError();
        });
    }
    else {
      this.common.showToast("Fo Selection is mandotry");
    }
  }

  saveDetails() {
    let date= this.common.dateFormatter(new Date(this.date1));
    if(this.vehicleType == "trolly"){
      this.refMode = 702;
    }else{
      this.refMode = 701;
    }
    this.common.loading++;
    let params = {
      foId : this.foId,
      vehicleId : this.vehicleId,
      date : date,
      tyreId : this.tyreId,
      tyrePos : this.position.frontRear+ "|"+this.position.axel+"|"+this.position.leftRight+"|"+this.position.pos,
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


