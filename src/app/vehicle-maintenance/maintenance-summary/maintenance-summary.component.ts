import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentReportComponent } from '../../documents/documentation-modals/document-report/document-report.component';
import { MaintenanceReportComponent } from '../model/maintenance-report/maintenance-report.component';
import { ViewSummaryDetailsComponent } from '../model/view-summary-details/view-summary-details.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'maintenance-summary',
  templateUrl: './maintenance-summary.component.html',
  styleUrls: ['./maintenance-summary.component.scss']
})
export class MaintenanceSummaryComponent implements OnInit {
  maintenanceData = [];
  headings = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  types = [
    { id: 0, name: "All" },
    { id: 1, name: "Expired" },
    { id: 2, name: "Expiring in 30 days" }
  ];
  typeId = "0";

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getDocumentData();
    this.common.refresh = this.refresh.bind(this);
    console.log("foid:", this.user._customer.id);
    // this.common.currentPage = 'Vehicle Documents Summary';
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  refresh() {
    console.log('Refresh');
    this.getDocumentData();
    // window.location.reload();
  }

  getDocumentData() {
    this.common.loading++;

    this.api.post('VehicleMaintenance/getMaintenanceSummary', {})
      .subscribe(res => {
        this.common.loading--;
        this.maintenanceData = res['data'];
        this.setTable(res['data']);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns(data) {
    let columns = [];
    data.map(doc => {
      let valobj = {};
      let total = {};
      let docobj = { maintenance_type_id: 0 };
      for (var i = 0; i < this.headings.length; i++) {
        let strval = doc[this.headings[i]];
        let status = '';
        let val = 0;
        if (strval && (strval + "").indexOf('_') > 0) {
          let arrval = strval.split('_');
          status = arrval[0];
          val = arrval[1];
        } else {
          val = strval;
        }
        docobj.maintenance_type_id = doc['_type_id'];
        valobj[this.headings[i]] = { value: val };//, class: (val > 0) ? 'blue' : 'black', action: val > 0 ? this.openData.bind(this, docobj, status) : '' };
      }
      valobj['details'] = { value: 'Details', class: 'blue', action: this.viewSummaryDetails.bind(this, doc['_jobid'], doc['_vid'], doc['Vehicle']) };
      columns.push(valobj);
      // columns.push(total);     
    });
    return columns;
  }

  viewSummaryDetails(jobId, vId, Vehicle) {
    console.log("JobId", jobId, "Vid", vId);
    if (!jobId || !vId) {
      this.common.showError("Failed");
      return;
    }
    this.common.params = { jobId: jobId, vId: vId, vehicleRegNo: Vehicle };
    const activeModal = this.modalService.open(ViewSummaryDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.refresh();
      }
    });
  }

  openData(docReoprt, status) {
    console.log("report", docReoprt, status);
    this.common.params = { docReoprt, status, title: 'Maintenance Report' };
    const activeModal = this.modalService.open(MaintenanceReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentData();
        window.location.reload();
      }
    });
  }

  getSum(key) {
    let total = 0;
    this.maintenanceData.map(data => {
      total += data[key];
    });
    return total;
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Document Summary";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  typeSelected() {
    console.log("type", this.typeId);

    switch (parseInt(this.typeId)) {
      case -1:
        this.setTable(this.maintenanceData);
        break;
      case 0:
      case 1:
      case 2:
        this.setTable(this.maintenanceData.filter(data => data._statusid == this.typeId));
      default:
        break;
    }
  }
  setTable(data) {
    console.log("data Count", data.length);
    this.headings = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    console.info("dashbord Data", data);
    let first_rec = data[0];
    this.table.data.headings = {};
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
        let hdgobj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = hdgobj;
      }
    }
    console.log("hdgs:");
    console.log(this.headings);
    console.log(this.table.data.headings);
    let headerObj = { title: 'Details', placeholder: 'Details' };
    this.table.data.headings['details'] = headerObj;
    this.table.data.columns = this.getTableColumns(data);
  }

}
