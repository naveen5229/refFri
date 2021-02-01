import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'trip-onward-delay',
  templateUrl: './trip-onward-delay.component.html',
  styleUrls: ['./trip-onward-delay.component.scss']
})
export class TripOnwardDelayComponent implements OnInit {
  showTable = false;
  onwardDelayData = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getData();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {

    this.getData();
  }
  getData() {
    this.onwardDelayData = [];
    this.common.loading++;
    this.api.get('TripsOperation/tripOnwardDelay')
      .subscribe(res => {
        this.common.loading--;

        console.log("result", res['data'][0].fn_trips_onwarddelay);
        this.onwardDelayData = JSON.parse(res['data'][0].fn_trips_onwarddelay);
        this.smartTableWithHeadings();

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  smartTableWithHeadings() {

    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.onwardDelayData != null) {
      console.log('onwardDelayData', this.onwardDelayData);
      let first_rec = this.onwardDelayData[0];
      console.log("first_Rec", first_rec);

      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table.data.headings[key] = headerObj;
        }

      }

      this.table.data.columns = this.getTableColumns();
      console.log("table:");
      console.log(this.table);
      this.showTable = true;
    } else {
      this.common.showToast('No Record Found !!');
    }


  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.onwardDelayData.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'black', action: '' };


      }
      this.valobj['style'] = { background: this.onwardDelayData[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

}
