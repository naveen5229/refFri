import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

import { from } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {DriverAttendanceUpdateComponent } from '../../modals/driver-attendance-update/driver-attendance-update.component';
@Component({
  selector: 'driver-attendance',
  templateUrl: './driver-attendance.component.html',
  styleUrls: ['./driver-attendance.component.scss', '../../pages/pages.component.css']
})
export class DriverAttendanceComponent implements OnInit {
 // driverAttendance = [];
 // length = 31;
   days = this.common.generateArray(28);
  arrdriverData= [{
   // days:null,
    name:null,
    attendance:null,
    id:null,
  }];
  
  //generatedArray=[];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService : NgbModal,
  ) {
    //this.getdriverList();
    //  var getDaysInMonth = function(month,year){
    //    return new Date={year, month , 0}.getDate();
    //  }
    this.getdriverAttendance();
  }
  
  ngOnInit() {
  }
   Update(details,attendance,days){
     this.common.params ={details,attendance,days};
   const activeModal = this.modalService.open(DriverAttendanceUpdateComponent,{size: 'md', container: 'nb-layout'});
   activeModal.result.then(data => {
    if (data.response) {
      // closeModal(true);
      this.getdriverAttendance();
    }
  });
   }
  getdriverAttendance() {
    this.common.loading++;
    let response;
    this.api.get('Drivers/getDriverAttendance')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        //this.= res['data'];
       // console.log('Attendance:',this.driverAttendance);
       this.arrdriverData = res['data'];
       console.log(this.arrdriverData)
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  

}
