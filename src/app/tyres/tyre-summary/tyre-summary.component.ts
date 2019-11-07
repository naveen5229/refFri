import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTyreSummaryComponent } from '../../modals/Tyres/vehicle-tyre-summary/vehicle-tyre-summary.component';

@Component({
  selector: 'tyre-summary',
  templateUrl: './tyre-summary.component.html',
  styleUrls: ['./tyre-summary.component.scss']
})
export class TyreSummaryComponent implements OnInit {


  data = [];

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
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openVehicleTyreSummary.bind(this, doc, 'site') };
        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  openVehicleTyreSummary(vehicleDetail) {
    console.log("tyre summary Modal", vehicleDetail);
    let vehicle = {
      id: vehicleDetail._vid,
      regno: vehicleDetail.Vehicle,
      refMode: vehicleDetail._refmode
    };
    this.common.params = { vehicle: vehicle, ref_page: 'tyre-summary' };
    console.log("vehicle", this.common.params);
    const activeModal = this.modalService.open(VehicleTyreSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {

    });
  }

}
