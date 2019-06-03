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
  timeout:any;


  constructor(
    public common: CommonService,
    public api: ApiService) {
    this.modelurl = this.common.params;
    console.log("STATE", this.modelurl);
  }


  RouterDetection(url) {

    let date;
    date = this.common.dateFormatter(new Date());
    console.log("date", date);
    let params = {
      webpage: url,
      addtime: date
    };
    this.api.post('UserRoles/setFoWebPageVisits', params)
      .subscribe(res => {
        this.common.showToast(res['msg']);
        console.log(res);
      }, err => {
        console.error(err);
        this.common.showError();
      });

    console.log("state_url", url);
  }
  ActivityHandler(state, date) {

    if(ACTIVITIES[state]==-1){
      clearInterval(this.timeout);
      console.log("++++++++++");

    }

    let params = {
      activity_type: ACTIVITIES[state],
      addTime: date
    };
    console.log(params); return;
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
   this.timeout=setInterval(() => {
      let state='heartBeat';
      let date;
      date = this.common.dateFormatter(new Date());
      this.ActivityHandler(state,date);
    }, 3000);
  }
}
