import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tyre-summary',
  templateUrl: './tyre-summary.component.html',
  styleUrls: ['./tyre-summary.component.scss']
})
export class TyreSummaryComponent implements OnInit {


  data = [];

  modelId = null;
  models = [];
  brands = [];
  brandId;
  mapping = 0;
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
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.refresh();
  }

  ngOnInit() {
  }

  vehicleBrandTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleBrandsMaster')
      .subscribe(res => {
        this.common.loading--;
        this.brands = res['data'];
        console.log("Brand Type", this.brands);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  vehicleModelTypes() {
    if (!this.brandId)
      return;
    this.common.loading++;
    this.api.get('Vehicles/getVehicleModelsMaster?brandId=' + this.brandId)
      .subscribe(res => {
        this.common.loading--;
        this.models = res['data'];
        console.log("models Type", this.models);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
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

  resetData(event) {
    this.modelId = null;
    document.getElementsByName('suggestion')[1]['value'] = '';
  }

  getTyreSummary() {
    this.common.loading++;
    this.api.get('Tyres/tyreSummary')
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

}
