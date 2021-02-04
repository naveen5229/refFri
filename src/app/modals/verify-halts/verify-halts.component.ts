import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { CommonService } from "../../services/common.service";


@Component({
    selector: 'verify-halts',
    templateUrl: './verify-halts.component.html',
    styleUrls: ['./verify-halts.component.scss']
  })
  export class VerifyHaltsComponent implements OnInit {

    haltExistingData = [];

    constructor(private common: CommonService, private api: ApiService){}

    ngOnInit(){}

    getVerifyHaltsFilterData(){
      this.common.loading++;
      this.api.verifyHaltsGet('autoHaltsGeneration?', this.getParamsData())
      .subscribe(res=> {
       this.common.loading--;
       console.log("response data", JSON.stringify(res));
       let data = [];
        console.log('res', res['data']);
        for(let d of res['data']){
            if(d.find(Object.keys('haltExisting'))){
                console.log();
                
            }
        }
        
       })
        console.log('get verify-halts data');     
       }
    
    getParamsData(){
       return `vehId=28607&startTime=2020-12-20%2000:00:00&endTime=2020-12-25%2023:59:59 `
    }


  }