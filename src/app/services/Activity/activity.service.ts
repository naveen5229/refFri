import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { ApiService } from '../api.service';

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


  constructor(
    public common: CommonService,
    public api: ApiService
  ) {
    this.modelurl = this.common.params;
    console.log("STATE", this.modelurl);
  }

  RouterDetection(url) {
    console.log("state_url", url);
  }
  ActivityHandler(state, date) {
    
    let params = {
      activity_type: ACTIVITIES[state],
      addTime: date
    };
    console.log(params);
    this.api.post('UserRoles/setActivitiesLogs', params)
      .subscribe(res => {
        this.common.showToast(res['msg']);
        console.log(res);
      }, err => {
        console.error(err);
        this.common.showError();
      });

  }
}
