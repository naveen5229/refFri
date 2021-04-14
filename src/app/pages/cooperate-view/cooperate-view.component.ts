import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()

@Component({
  selector: 'cooperate-view',
  templateUrl: './cooperate-view.component.html',
  styleUrls: ['./cooperate-view.component.scss']
})
export class CooperateViewComponent implements OnInit {
  seletionsArray = ["Tmg-Vehicle-Analysis","Tmg-Loading-Analysis","Tmg-Unloading-Analysis","Tmg-Transporter-Analysis"];
  selectedDashboard = 'Tmg-Vehicle-Analysis';
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

}
