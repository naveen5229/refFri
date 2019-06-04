import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';
import { FunctionExpr } from '@angular/compiler';
import { TimeoutError } from 'rxjs';

const ACTIVITIES = {
  heartBeat: 0,
  login: 1,
  logout: -1,
  active: 2,
  inactive: -2
};



@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  timeout: any;
  state = 'active';

  constructor(
    public common: CommonService,
    public api: ApiService) {
    if (this.api.user._details) this.heartbeat();
  }


  routerDetection(url) {
    const params = {
      webpage: url.split('/')[url.split('/').length - 1],
      addtime: this.common.dateFormatter(new Date())
    };
    this.api.post('UserRoles/setFoWebPageVisits', params)
      .subscribe(res => console.log('Page View Api Response:', res),
        err => console.error('Page View Api Error:', err));
  }

  activityHandler(state) {
    if (ACTIVITIES[state] == -1) {
      clearInterval(this.timeout);
    }

    const params = {
      activity_type: ACTIVITIES[state],
      addTime: this.common.dateFormatter(new Date())
    };

    console.log("final param", params);
    this.api.post('UserRoles/setActivitiesLogs', params)
      .subscribe(res => console.log('Activity Api Response:', res),
        err => console.error('Activity Api Error:', err));

  }

  heartbeat() {
    this.timeout = setInterval(() => this.activityHandler(this.state), 10000);
  }
}
