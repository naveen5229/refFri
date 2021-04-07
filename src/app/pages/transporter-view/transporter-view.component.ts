import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'transporter-view',
  templateUrl: './transporter-view.component.html',
  styleUrls: ['./transporter-view.component.scss']
})
export class TransporterViewComponent implements OnInit {
  seletionsArray = ['Tmg-Challan', "Tmg-Trip", "Tmg-Traffic","Tmg-Calls","Tmg-Alerts","Tmg-Documents","Tmg-Vehicle-Analysis"];
  selectedDashboard = 'Tmg-Challan';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(){}

  getIndex() {
    for (let i = 0; i <= this.seletionsArray.length; i++) {
      if (this.seletionsArray[i] == this.selectedDashboard) {
        return i;
      }
    }
  }

}
