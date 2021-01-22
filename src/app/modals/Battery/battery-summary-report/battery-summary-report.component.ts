import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'battery-summary-report',
  templateUrl: './battery-summary-report.component.html',
  styleUrls: ['./battery-summary-report.component.scss']
})
export class BatterySummaryReportComponent implements OnInit {

  data = [];
  vehicleId = null;
  refMode = null;
  vehicleRegNo = null;
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.vehicleId = this.common.params.vehicle.id;
    this.refMode = this.common.params.vehicle.refMode;
    this.vehicleRegNo = this.common.params.vehicleRegNo;
    this.common.refresh = this.refresh.bind(this);
    this.refresh();
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  refresh() {
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};
    this.getBetterySummary();
  }



  getBetterySummary() {
    this.common.loading++;

    let params = 'refId=' + this.vehicleId +
      '&refMode=' + this.refMode;

    console.log("params ", params);
    this.api.get('Battery/getBatteryDetailsWrtVeh?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = JSON.parse(res['data'][0].fn_battery_getvehbattery);

        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!this.data || !this.data.length) {
          //document.getElementById('mdl-body').innerHTML = 'No record exists';
          return;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }
  closeModal() {
    this.activeModal.close();
  }



}
