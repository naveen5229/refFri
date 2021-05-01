import { Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ware-house-dashbord',
  templateUrl: './ware-house-dashbord.component.html',
  styleUrls: ['./ware-house-dashbord.component.scss']
})
export class WareHouseDashbordComponent implements OnInit {

  constructor() { }

  ngOnDestroy(){}
ngOnInit() {
  }

}
