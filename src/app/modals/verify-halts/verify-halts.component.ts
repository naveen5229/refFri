import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { CommonService } from "../../services/common.service";
import { FormGroup } from "@angular/forms";


@Component({
  selector: 'verify-halts',
  templateUrl: './verify-halts.component.html',
  styleUrls: ['./verify-halts.component.scss']
})
export class VerifyHaltsComponent implements OnInit {

  verifyHaltsForm: FormGroup;

  submitted = false;
  filterVar = {
    vehicleId: '',
    startTime: new Date(),
    endTime: new Date(),
  }
  haltNew = []
  haltExisting = []

  constructor(private common: CommonService, private api: ApiService, private httpCLient: HttpClient) {
    this.filterVar.startTime = new Date();
    this.filterVar.endTime = new Date();
  }

  ngOnInit() { }

  getVerifyHaltsFilterData() {
    let params = {
      vehicleId: this.filterVar.vehicleId,
      startTime: this.common.dateFormatter(this.filterVar.startTime),
      endTime: this.common.dateFormatter(this.filterVar.endTime),
    }
    console.log("params", params);
    this.common.loading++;
    this.api.verifyHaltsGet('autoHaltsGeneration?', `vehId=${params.vehicleId}&startTime=${params.startTime}&endTime=${params.endTime}`)
      .subscribe(res => {
        this.common.loading--;
        this.haltExisting = res['haltExisting'];
        this.haltNew = res['haltNew'];
        console.log('halfExisting data :', this.haltExisting);
        console.log('haltNew data :', this.haltNew);
      },
        err => {
          console.error(err);
          this.common.showError();
        });
  }

  getParamsData() {
    return `vehId=${this.filterVar.vehicleId}&startTime=${this.filterVar.startTime}&endTime=2020-12-25 2023:59:59`
  }

  getVehicleData(vehicle) {
    console.log("vehicle", vehicle);
    this.filterVar.vehicleId = vehicle.id;
  }

}