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

  vehicleType = "truck";
  refMode = 701;

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
  date1 = this.common.dateFormatter(new Date());
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
  }
  // getDate(date) {
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.date = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.date);
  //   });
  // }

  saveDetails() {
    let date= this.common.dateFormatter(new Date(this.date1));
    if(this.vehicleType == "trolly"){
      this.refMode = 702;
    }else{
      this.refMode = 701;
    }
    this.common.loading++;
    let params = {
      vehicleId : this.vehicleId,
      date : date,
      tyres : JSON.stringify(this.tyres),
      remark : this.remark,
      status : this.status,
      checkedBy :this.checkedBy,
      refMode : this.refMode

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
      if(this.vehicleType == "trolly"){
        this.refMode = 702;
      }else{
        this.refMode = 701;
      }
      let params = 'vehicleId=' +this.vehicleId+
      '&refMode=' + this.refMode;
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
}
