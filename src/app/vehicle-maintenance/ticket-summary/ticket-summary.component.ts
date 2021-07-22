import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AddMaintenanceComponent } from '../model/add-maintenance/add-maintenance.component';

@Component({
  selector: 'ticket-summary',
  templateUrl: './ticket-summary.component.html',
  styleUrls: ['./ticket-summary.component.scss']
})
export class TicketSummaryComponent implements OnInit {

  servicetypes = [];
  data = [];
  dataForFilter = [];
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
  summaryRange = {
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date(),
    status: 'Pending',
    serviceType: []
  }
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) {
    this.ticketSummary();
    this.getServiceType();
  }

  ngOnInit(): void {
  }

  getServiceType() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/getHeadMaster')
      .subscribe(res => {
        this.common.loading--;
        console.log("Data :", res);
        this.servicetypes = res['data'] || [];
        // this.servicetypes.splice(0, 0, { id: -1, name: 'All' })
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  ticketSummary() {
    this.data = [];
    let param = `?fromdate=${this.common.dateFormatter1(this.summaryRange.startDate)}&todate=${this.common.dateFormatter1(this.summaryRange.endDate)}&status=${null}&servicetype=${null}`;
    // return console.log(param)
    this.common.loading++;
    this.api.get('VehicleMaintenance/getTicketSummary' + param)
      .subscribe(res => {
        this.common.loading--;
        console.log("Data :", res);
        // this.data = res['data'] || [];
        this.dataForFilter = res['data'] || [];
        this.filterSummary();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  filterSummary() {
    this.resetTable();
    console.log(this.summaryRange.serviceType)
    if (this.summaryRange.serviceType == null || this.summaryRange.serviceType.length === 0) {
      if (this.summaryRange.status === 'All') {
        this.data = this.dataForFilter;
      } else {
        this.data = this.dataForFilter.filter(summary => { return summary._status.toLowerCase() == this.summaryRange.status.toLowerCase() });
      }
    } else {
      let serviceTypes = this.summaryRange.serviceType.map(type => type.name.toLowerCase());
      console.log(serviceTypes)
      if (this.summaryRange.status === 'All') {
        this.data = this.dataForFilter.filter(summary => { return serviceTypes.includes(summary.Service.toLowerCase()) });
      } else {
        this.data = this.dataForFilter.filter(summary => { return serviceTypes.includes(summary.Service.toLowerCase()) && summary._status.toLowerCase() == this.summaryRange.status.toLowerCase() });
      }
    }
    console.log(this.data);
    this.setTable();
  }

  setTable() {
    let first_rec = this.data[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
        let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = headerObj;
      }
    }

    this.table.data.columns = this.getTableColumns();
  }

  resetTable() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action') };
    this.table.data.headings['Action'] = action;
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = {
        icons: [
          { class: "fa fa-retweet mr-3", action: this.addMaintenance.bind(this, doc) }
        ]
        , action: null
      };
      columns.push(this.valobj);
    });
    console.log(this.table)
    return columns;
  }

  addMaintenance(doc) {
    console.log("doc:", doc);
    this.common.params = { title: 'Add Maintenance', vehicleId: doc['_vid'], regno: doc['Vehicle'],doc, sId: doc['_partid'], modal: 'tktSummary' };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.ticketSummary();
      }
    });
  }

}
