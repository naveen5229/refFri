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
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) { 
    this.ticketSummary();
  }

  ngOnInit(): void {
  }

  ticketSummary() {
    this.data = [];
    this.common.loading++;
    this.api.get('VehicleMaintenance/getTicketSummary')
      .subscribe(res => {
        this.common.loading--;
        console.log("Data :", res);
        this.data = res['data'] || [];
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
          { class: "fa fa-edit mr-3", action: this.addMaintenance.bind(this, doc)}
        ]
        , action: null
      };
      columns.push(this.valobj);
    });
    return columns;
  }

  addMaintenance(doc){
    console.log("doc:",doc);
    this.common.params = { title: 'Add Maintenance', vehicleId: doc['_vid'], regno:doc['Vehicle'],sId:doc['_partid'],modal:'tktSummary' };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.ticketSummary();
      }
    });
  }

}
