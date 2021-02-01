import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'gps-trails',
  templateUrl: './gps-trails.component.html',
  styleUrls: ['./gps-trails.component.scss']
})
export class GpsTrailsComponent implements OnInit {

  constructor() { }

  ngOnDestroy(){}
ngOnInit() {
  }

}
