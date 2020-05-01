/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, HostListener } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { CommonService } from './services/common.service';
import { ActivityService } from './services/Activity/activity.service';
import { UserService } from './services/user.service';
import { ApiService } from './services/api.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';


@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  timeout: any;
  userId = null;
  allPagesList = [];
  sections = [];
  pagesGroups = [];
  getAdminpage: any;
  constructor(private analytics: AnalyticsService,
    public common: CommonService,
    public user: UserService,
    public activity: ActivityService,
    private router: Router,
    public api: ApiService) {
    if (this.user._details) {
      this.getUserPagesList();
    }
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }

  @HostListener('document:mousemove', ['$event'])
  onmousemove = () => {
    if (this.user._loggedInBy !== 'customer') return;

    if (this.activity.state == 'inactive') {
      this.activity.state = 'active';
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.activity.state = 'inactive';
    }, 120000);
  }


  getUserPagesList() {
    let userTypeId = this.user._loggedInBy == 'admin' ? 1 : 3;
    const params = {
      userId: this.user._details.id,
      userType: userTypeId,
      iswallet : localStorage.getItem('iswallet') || '0' 

    };
    // this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        // this.common.loading--;
        this.user._pages = res['data'].filter(page => {
         
          return page.userid;
        });
        localStorage.setItem('DOST_USER_PAGES', JSON.stringify(this.user._pages));
        console.log('USER PAGES:', this.user._pages);
        this.user.filterMenu("pages", "pages");
        this.user.filterMenu("admin", "admin");
        this.user.filterMenu("tyres", "tyres");
        this.user.filterMenu("battery", "battery");
        this.user.filterMenu("vehicleMaintenance", "vehicleMaintenance");
        this.user.filterMenu("wareHouse", "wareHouse");
        this.user.filterMenu("account", "account");
        this.user.filterMenu("challan", "challan");
        this.user.filterMenu("walle8", "walle8");
        this.user.filterMenu("loadIntelligence", "loadIntelligence");


      }, err => {
        // this.common.loading--;
        console.log('Error: ', err);
      })
  }


}
