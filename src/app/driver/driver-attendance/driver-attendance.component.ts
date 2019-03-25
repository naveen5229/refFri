import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

import { from } from 'rxjs';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'driver-attendance',
  templateUrl: './driver-attendance.component.html',
  styleUrls: ['./driver-attendance.component.scss', '../../pages/pages.component.css']
})
export class DriverAttendanceComponent implements OnInit {
  driverList = [];
  length = 31;
  days = this.common.generateArray(31);
  
  //generatedArray=[];
  constructor(
    public api: ApiService,
    public common: CommonService,
  ) {
    this.getdriverList();
    //  var getDaysInMonth = function(month,year){
    //    return new Date={year, month , 0}.getDate();
    //  }

  }
  
  ngOnInit() {
  }

  getdriverList() {
    this.common.loading++;
    let response;
    this.api.get('Drivers/getFoDrivers')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverList = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  

}
