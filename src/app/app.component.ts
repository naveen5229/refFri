/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, HostListener } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { CommonService } from './services/common.service';
import { ActivityService } from './services/Activity/activity.service';


@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {


  count: number = 0;
  date = new Date();
  timeout: any;
  state = 'active';
  constructor(private analytics: AnalyticsService,
    public common: CommonService,
  public activity: ActivityService) {
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }

  @HostListener('mouseenter') dosomet() {
    console.log('Active');
    
   // date = this.date.getTime();



    //console.log("Date1", (date / 1000));
  }

  @HostListener('mouseleave') dosomett() {
    console.log('mouse leave');
    //this.date=new Date();
   // console.log("Date", this.date);
    //console.log(this.count++);

  }

  @HostListener('document:mousemove', ['$event'])
  onmousemove =  () => {
    if (this.state == 'inactive') {
      console.log('Active');
      let date;
      date=this.common.dateFormatter(new Date());
       console.log("dateformatter1",date);
      this.state = 'active';
      this.activity.ActivityHandler(this.state,date);
    }
    localStorage.setItem('LastMouseActiveTime', (new Date()).toString());
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let savedTime = new Date(localStorage.getItem('LastMouseActiveTime'));
      let currentTime = new Date();
      this.state = 'inactive';
      console.log('InActive');
      let date;
      date=this.common.dateFormatter(new Date());
      console.log("dateformatter2",date);
      this.activity.ActivityHandler(this.state,date);
     // console.log('Dates::::::::::::', savedTime, currentTime);
    }, 5000);
  }
  // onMouseMove(e) {
  //   console.log(e);
  //   console.log(this.count++);
  // }
}
