import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-tyre-summary',
  templateUrl: './vehicle-tyre-summary.component.html',
  styleUrls: ['./vehicle-tyre-summary.component.scss']
})
export class VehicleTyreSummaryComponent implements OnInit {


  data = [];
  vehicleId = null;
  refMode = "701";
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
  tyreHistory=0;

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.vehicleId = this.common.params.vehicle.id;
    this.refMode = this.common.params.vehicle.refMode;
    this.vehicleRegNo = this.common.params.vehicle.regno;
    console.log("regno",this.vehicleRegNo);
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
    this.getTyreSummary();
  }



  getTyreSummary() {
    this.common.loading++;
    let params = 'vehicleId=' + this.vehicleId +
      '&refMode=' + this.refMode+'&isHistory='+this.tyreHistory;
    console.log("params ", params);
    this.api.get('Tyres/getVehicleTyreDetails?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
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
  viewTyreHistory(){
    this.tyreHistory=1;
    this.refresh();
  }
}
