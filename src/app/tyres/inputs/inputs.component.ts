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

  date = this.common.dateFormatter(new Date());
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
      '&foId=' + this.foId;
    this.api.get('Suggestion/getFoVehicleList?' + params) // Customer API
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


  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.date);
    });
  }

  saveDetails() {
    this.common.loading++;
    let params = {
      foId : this.foId,
      vehicleId : this.vehicleId,
      date : this.date,
      tyreId : this.tyreId,
      frontRear : this.position.frontRear,
      axel : this.position.axel,
      leftRight : this.position.leftRight,
      position : this.position.pos
    };
    console.log('Params:', params);

    this.api.post('Tyres/saveTyreInputs', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id ", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("sucess");
        } else {
          this.common.showToast(res['data'][0].rtn_msg);
        }
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  searchData() {
    if (this.foId) {

      let params = 'foId=' + this.foId
      console.log("params ", params);
      this.api.get('Tyres/getTyreInputsAccordingFO?' + params)
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
}

