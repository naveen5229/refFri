import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { AddMaintenanceComponent } from '../model/add-maintenance/add-maintenance.component';
import * as _ from 'lodash';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

@Component({
  selector: 'ticket-summary',
  templateUrl: './ticket-summary.component.html',
  styleUrls: ['./ticket-summary.component.scss']
})
export class TicketSummaryComponent implements OnInit {

  csvTitle = null;
  servicetypes = [];
  data = [];
  dataForFilter = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: true,
      pageLimit: 200
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
    private modalService: NgbModal,
    private pdfService: PdfService,
    private csvService: CsvService
  ) {
    this.ticketSummary();
    this.getServiceType();
    console.log(this.user)
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
      if (key === "Mf Date" || key === "Target Service Date" || key === "Gen Date") {
        this.table.data.headings[key]["type"] = "date";
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
        hideHeader: true,
        pagination: true,
        pageLimit: 200
      }
    };
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    // let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action') };
    // this.table.data.headings['Action'] = action;
    let columns = [];
    console.log("Data=", this.data);
    this.data.map((doc, index) => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = {
        // icons: [
        //   { class: "fa fa-retweet mr-3", action: this.addMaintenance.bind(this, doc) }
        // ]
        // , 
        // action:null,
        icons: [],
        action: this.handleChecBoxClick.bind(this, doc, index),
        isCheckbox: true
      };
      columns.push(this.valobj);
    });
    console.log(this.table)
    this.csvTitle = `${this.user._customer.name},Ticket-Summary,${this.common.dateFormatter1(this.summaryRange.startDate)}-${this.common.dateFormatter1(this.summaryRange.endDate)}`;
    return columns;
  }

  commonTransportCollection = [];
  handleChecBoxClick(doc, index) {
    // if (this.commonTransportCollection && this.commonTransportCollection.length > 0) {
    //   this.commonTransportCollection.forEach(ele => {
    //     if ((ele.Vehicle).toLowerCase() != (doc.Vehicle).toLowerCase()) {
    //       return this.common.showError('Vehicle Not Matched');
    //     } else {
    //       this.data[index].isChecked = true;
    //       this.commonTransportCollection.push(doc)
    //     }
    //   })
    // } else {
    //   this.data[index].isChecked = true;
    //   this.commonTransportCollection.push(doc)
    // }
    // setTimeout(() => {
    //   this.getTableColumns();
    // }, 1000);
    // console.log("handleChecBoxClick ~ doc", this.commonTransportCollection, this.data)

    let existAtIndex = null;
    if (this.commonTransportCollection && this.commonTransportCollection.length > 0) {
      existAtIndex = this.commonTransportCollection.findIndex((ele) => { return ele._ticket_id === doc._ticket_id });
    } else {
      let docEle = JSON.parse(JSON.stringify(doc));
      docEle._partid = [docEle._partid];
      this.addMaintenance(docEle);
    }
    console.log(existAtIndex)
    if (existAtIndex == 0 || existAtIndex > 0) {
      this.commonTransportCollection.splice(existAtIndex, 1);
    } else {
      this.commonTransportCollection.push(doc);
    }

    console.log(this.commonTransportCollection)

  }

  closeTickets() {
    let group = _.groupBy(this.commonTransportCollection, 'Vehicle');
    console.log(group, Object.keys(group).length);
    if (Object.keys(group).length > 1) return this.common.showError(`Please Select Same Vehicle number`);
    let serviceIds = [];
    this.commonTransportCollection.map(ele => {
      serviceIds.push(ele['_partid']);
    });
    let doc = JSON.parse(JSON.stringify(this.commonTransportCollection[0]));
    doc._partid = serviceIds
    console.log(doc);
    this.addMaintenance(doc);
  }

  addMaintenance(doc) {
    let services = this.commonTransportCollection.map(ele => ele._partid);
    console.log("doc:", doc);
    this.common.params = { title: 'Add Maintenance', vehicleId: doc['_vid'], regno: doc['Vehicle'], doc, sId: doc['_partid'], modal: 'tktSummary' };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.ticketSummary();
        this.commonTransportCollection = [];
      }
    });
  }

  printPDF() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.foName;
    console.log("Name:", name);
    let details = [
      ['Name: ' + name, 'Report: ' + 'Ticket Summary'],
      ['Start Date: ' + this.common.dateFormatter(new Date(this.summaryRange.startDate)), 'End Date: ' + this.common.dateFormatter(new Date(this.summaryRange.endDate))]
    ];
    this.pdfService.jrxTablesPDF(['ticket-Maintenance'], this.csvTitle, details);
  }

  printCSV() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.foName;
    let details = [
      { name: 'Name:' + name },
      { report: "Report:Ticket Summary" },
      { startdate: 'Start Date:' + this.common.dateFormatter(new Date(this.summaryRange.startDate)) },
      { enddate: 'End Date:' + this.common.dateFormatter(new Date(this.summaryRange.endDate)) }
    ];
    this.csvService.byMultiIds(['ticket-Maintenance'], this.csvTitle, details);
  }
}
