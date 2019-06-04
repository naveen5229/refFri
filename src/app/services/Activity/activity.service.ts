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

  modelurl = "";
  timeout: any;
  state = 'active';
  date = null;
  dd: any;

  constructor(
    public common: CommonService,
    public api: ApiService) {
    this.modelurl = this.common.params;
    console.log("STATE", this.state);
  }

  getState(params) {
    this.state = params.state;
    this.date = params.date;
    console.log("1234", this.state, this.date);
  }

  routerDetection(url) {
    const params = {
      webpage: url.split('/')[url.split('/').length -1],
      addtime: this.common.dateFormatter(new Date())
    };
    console.log('Page Params: ', params);
    this.api.post('UserRoles/setFoWebPageVisits', params)
      .subscribe(res => console.log('Page View Api Response:', res),
        err => console.error('Page View Api Error:', err));
  }

  ActivityHandler(state) {

    if (ACTIVITIES[state] == -1) {
      clearInterval(this.timeout);
      console.log("++++++++++");
    }
    let params = {
      activity_type: ACTIVITIES[state],
      addTime: this.common.dateFormatter(new Date())
    };
    console.log("final param", params); return;
    this.api.post('UserRoles/setActivitiesLogs', params)
      .subscribe(res => {
        this.common.showToast(res['msg']);
        console.log(res);
      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  heartbeat() {
    this.timeout = setInterval(() => {
      // let state=this.State;
      // let Date=this.date;
      // date = this.common.dateFormatter(new Date());
      this.ActivityHandler(this.state);
    }, 3000);
  }
}
