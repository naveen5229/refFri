import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  vehicleTyreDetails = []
  remark = "";
  status = "";
  checkedBy = null;
  admins = [];

  date1 = this.common.dateFormatter(new Date());
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.common.refresh = this.refresh.bind(this);
    this.getAdmin();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getAdmin();
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

  resetVehDetails() {
    this.vehicleNo = "";
    this.vehicleId = null;
    this.searchVehicleString = "";
    this.tyres = [];
  }
  searchVehicles() {
    this.vehicleSuggestion = true;
    let params = 'search=' + this.searchVehicleString +
      '&vehicleType=' + this.vehicleType;
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
    this.searchVehicleString = this.vehicleNo;
    this.vehicleSuggestion = false;
    this.searchData();
  }
  // getDate(date) {
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.date = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.date);
  //   });
  // }

  saveDetails() {
    if (!this.checkedBy) {
      alert("Check by is Mandatory");
    } else {
      let date = this.common.dateFormatter(new Date(this.date1));
      this.common.loading++;
      this.vehicleTyreDetails.forEach(vehicleTyreDetail => {
        let tyredata = [];
        vehicleTyreDetail.vdata.forEach(axle => {
          axle.data.forEach(tyre => {
            console.log(tyre)
            tyredata.push(tyre);
          });

        });
        //console.log("tyre",tyredata);

        let params = {
          vehicleId: vehicleTyreDetail.vid,
          date: date,
          tyres: JSON.stringify(tyredata),
          remark: this.remark,
          status: this.status,
          checkedBy: this.checkedBy,
          refMode: vehicleTyreDetail.vtype

        };

        this.api.post('Tyres/saveTyreHealthDetails', params)
          .subscribe(res => {
            console.log("return id ", res['data'][0].rtn_id);
            if (res['data'][0].rtn_id > 0) {
              console.log("sucess");
              this.common.showToast("sucess");
            } else {
              console.log("fail");
              this.common.showToast(res['data'][0].rtn_msg);
            }
          }, err => {
            console.error(err);
            this.common.showError();
          });
      });
      this.common.loading--;
    }

  }
  searchData() {
    if (this.vehicleType == "trolly") {
      this.refMode = 702;
    } else {
      this.refMode = 701;
    }
    let params = 'vehicleId=' + this.vehicleId +
      '&refMode=' + this.refMode +
      '&mapped=1';
    console.log("params ", params);
    this.api.get('Tyres/getVehicleTyrePosition?' + params)
      .subscribe(res => {
        this.tyres = res['data'];
        this.vehicleTyreDetails = JSON.parse(res['data'][0].fn_getvehicletyredetails);
        console.log("searchedTyreDetails", this.vehicleTyreDetails);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }
}
