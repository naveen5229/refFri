import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tmg',
  templateUrl: './tmg.component.html',
  styleUrls: ['./tmg.component.scss']
})
export class TmgComponent implements OnInit {
  seletionsArray = ['Tmg-Challan', "Tmg-Trip", "Tmg-Traffic","Tmg-Calls","Tmg-Alerts","Tmg-Documents","Tmg-Vehicle-Analysis","Tmg-Loading-Analysis","Tmg-Unloading-Analysis","Tmg-Transporter-Analysis"];
  selectedDashboard = 'Tmg-Challan';
  constructor() {

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  getIndex() {
    for (let i = 0; i <= this.seletionsArray.length; i++) {
      if (this.seletionsArray[i] == this.selectedDashboard) {
        return i;
      }
    }
  }
  forwardMove() {
    let index = this.getIndex();
    if (index == this.seletionsArray.length-1) {
      this.selectedDashboard = this.seletionsArray[0];
    } else {
      this.selectedDashboard = this.seletionsArray[index + 1];
    }
  }
  backwardMove() {
    let index = this.getIndex();
    if (index == 0) {
      this.selectedDashboard = this.seletionsArray[this.seletionsArray.length-1];
    } else {
      this.selectedDashboard = this.seletionsArray[index - 1];
    }
  }

}
