import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'tripmasterreport',
  templateUrl: './tripmasterreport.component.html',
  styleUrls: ['./tripmasterreport.component.scss']
})
export class TripmasterreportComponent implements OnInit {
  tripData=[];
  tripMasterReportData=[];
  selectedVehicle = {
    id: 0
  };
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  startTime = new Date();
  endTime = new Date();

  constructor(public api:ApiService,
    public common:CommonService,
    public user:UserService) {
    let today = new Date();
    this.startTime = new Date(today.setDate(today.getDate() - 1));
     }

    ngOnInit(): void {
    }

    getVehicle(vehicle) {
      console.log('test fase', vehicle);
      this.selectedVehicle = vehicle;
      console.log('test fase',this.selectedVehicle.id);
  }

  // getTripMasterReport(){

  // }

  getTripMasterReport() {
    this.tripData=[];
    const params = "vid="+this.selectedVehicle.id+"&startTime=" + this.common.dateFormatter(this.startTime) +
    "&endTime=" + this.common.dateFormatter(this.endTime);
    this.common.loading++;
    this.api.get('TripsOperation/getTripMasterReport?'+params)
      .subscribe(res => {
        this.common.loading--;
        if(res['code']>0){
        this.tripMasterReportData = res['data'] ? res['data'] : [];
        this.tripData=this.tripMasterReportData.map(item => {item.origin = item['trp_points'][0];
        let last=item['trp_points'].length-1;
        item.via=item['trp_points'].length>2 ?item['trp_points'][1]:'';
        item.destination=item['trp_points'].length>=2 ? item['trp_points'][last]:'';

        console.log("origin:",item.origin);
        console.log("via:",item.via);
        console.log("destination:",item.destination);
          
        // item['trp_points'][1]='Via';
        // item['trp_points'][last]='Destination';
        return item;
        })

        console.log("tripData:",this.tripData);

        
        console.log("data:",this.tripMasterReportData);
        }else{
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

}
