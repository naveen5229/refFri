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


@Component({
  selector: 'ngx-app',
  templateUrl: './app.component.html',

})
export class AppComponent implements OnInit {
  timeout: any;

  constructor(private analytics: AnalyticsService,
    public common: CommonService,
    public user: UserService,
    public activity: ActivityService) {
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
    },120000);
  }
 
}
