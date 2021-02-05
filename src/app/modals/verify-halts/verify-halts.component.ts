import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { CommonService } from "../../services/common.service";
import verifyHalts from '../../../assets/verify-halts.json';
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
    haltExistingData:[] = verifyHalts;
    haltNew = []
    haltExisting = []
    

    constructor(private common: CommonService, private api: ApiService, private httpCLient: HttpClient){
    }

    ngOnInit(){}

    getVerifyHaltsFilterData(){
      let params = {
        vehicleId: this.filterVar.vehicleId,
        startTime: this.common.dateFormatter(this.filterVar.startTime),
        endTime: this.common.dateFormatter(this.filterVar.endTime).split(' ')[0],
      }
      console.log("params", params);
    //   this.common.loading++;
    //   this.api.verifyHaltsGet('autoHaltsGeneration?', this.getParamsData())
    //   .subscribe(res=> {
    //    this.common.loading--;
    //    console.log("response data", JSON.stringify(res));
    //    let data = [];
    //     console.log('res', res['data']);

    //   })
    //     console.log('get verify-halts data');     
    //    }
    
    // getParamsData(){
    //    return `vehId=${this.filterVar.vehicleId}&startTime=${2020-12-20%2000:00:00}&endTime=${2020-12-25%2023:59:59} `
    // }
    

    // getVerifyHaltsFilterData(){
    //   console.log(JSON.stringify(this.haltExistingData));
     
    //   this.haltExisting = this.haltExistingData['haltExisting']
    //   this.haltNew = this.haltExistingData['haltNew'];

    }

    getVehicleData(vehicle){
      console.log("vehicle", vehicle);
      this.filterVar.vehicleId = vehicle.id;
    }


  }