import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'dispatch-orders',
  templateUrl: './dispatch-orders.component.html',
  styleUrls: ['./dispatch-orders.component.scss']
})
export class DispatchOrdersComponent implements OnInit {

  startDate = "";
  endDate = "";
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  }

  constructor(public common: CommonService,
    public api: ApiService) {

     }

  ngOnInit() {
  }


  search() {
  }

}
