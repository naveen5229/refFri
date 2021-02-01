import { Component, OnInit } from '@angular/core';
import { DateService } from '../../services/date/date.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'date-service-tester',
  templateUrl: './date-service-tester.component.html',
  styleUrls: ['./date-service-tester.component.scss']
})
export class DateServiceTesterComponent implements OnInit {

  dateType: string = "";
  dateEntered: string = "";
  dateSeperator: string = "";
  formattedDate: string = "";

  formattedTime: string="";
  timeType: string = "";

  constructor(
    public dateService: DateService,
    public datePipe: DatePipe,
    public common: CommonService
  ) {

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  dateFormatSetter() {
    console.log("dateType=", this.dateType);
    console.log("dateEntered=", this.dateEntered);
    console.log("dateSeperator=", this.dateSeperator);
    console.log("timeType=",this.timeType);
    this.formattedDate = this.dateService.dateFormatter(this.dateEntered, this.dateType, this.dateSeperator);
    this.formattedTime = this.dateService.timeFormatter(this.dateEntered, this.timeType);
  }

}
