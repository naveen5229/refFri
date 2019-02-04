import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'tyre-health-check-up',
  templateUrl: './tyre-health-check-up.component.html',
  styleUrls: ['./tyre-health-check-up.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class TyreHealthCheckUpComponent implements OnInit {
  foName = "";
  foId = null;
  vehicleType = "truck";
  vehicleNo = "";
  vehicleId = null;
  
  searchString = "";
  searchVehicleString = "";

  showSuggestions = false;
  vehicleSuggestion = false;

  foUsers = [];
  vehicles = [];
  tyres = [];
  remark = "";
  status = "";
  checkedBy = null;
  admins =[];
  date = this.common.dateFormatter(new Date());
 

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) { 
    this.getAdmin();
  }

  ngOnInit() {
  }

  getAdmin() {
    this.api.get('Suggestion/getAllElogistAdminList?') // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.admins = res['data'];
        console.log("admins", this.admins);

      }, err => {
        console.error(err);
        this.common.showError();
      });
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
   this.searchVehicleString = "";
   this.tyres = []; 
 }
  searchVehicles() {
    this.vehicleSuggestion = true;
    let params = 'search=' + this.searchVehicleString +
      '&foId=' + this.foId+
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
    this.searchVehicleString = this.vehicleNo + " - " + this.vehicleId;
    this.vehicleSuggestion = false;
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
      tyres : this.tyres,
      remark : this.remark,
      status : this.status,
      checkedBy :this.checkedBy

    };
    console.log('Params:', params);

    this.api.post('Tyres/saveTyreHealthDetails', params)
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
  searchData() {
    if (this.foId) {
      let params = 'foId=' + this.foId+
      '&vehicleId=' +this.vehicleId;
      console.log("params ", params);
      this.api.get('Tyres/getTyreHealths?' + params)
        .subscribe(res => {
          this.tyres = res['data'];
          console.log("searchedTyreDetails", this.tyres);

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
