import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'choose-periods',
  templateUrl: './choose-periods.component.html',
  styleUrls: ['./choose-periods.component.scss']
})
export class ChoosePeriodsComponent implements OnInit {
  title = '';
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  minutes = [15, 30, 45, 60];
  time = null;
  hrs = '00';
  mins = '00';
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    console.log("params", this.common.params);
    if (this.common.params.title) {
      this.title = this.common.params.title;
    }
    else {
      this.title = "Time Duration";
    }
  }

  setHours(hour) {
    this.hrs = '00';
    this.hrs = hour
    this.time = this.hrs + '.' + this.mins;
    console.log("time hrs", this.time);
  }
  setMinutes(minute) {
    this.mins = '00';
    this.mins = minute
    this.time = this.hrs + '.' + this.mins;
    console.log("time mins", this.time);

  }

  dismiss() {
    this.activeModal.close();
  }


  ngOnDestroy(){}
ngOnInit() {
  }

  setPeriod() {
    setTimeout(() => {
      this.activeModal.close({ duration: this.time, hrs: this.hrs, mins: this.mins });
    });
  }
}
