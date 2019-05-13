import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentReportComponent } from '../../documents/documentation-modals/document-report/document-report.component';

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

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getDocumentData();
    this.common.refresh = this.refresh.bind(this);
    console.log("foid:", this.user._customer.id);
    // this.common.currentPage = 'Vehicle Documents Summary';
  }

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
    //this.getDocumentData();
    window.location.reload();
  }

  getDocumentData() {
    this.common.loading++;

    this.api.post('VehicleMaintenance/getMaintenanceSummary', {})
      .subscribe(res => {
        this.common.loading--;
        this.maintenanceData = res['data'];
        console.info("dashbord Data", this.maintenanceData);
        let first_rec = this.maintenanceData[0];
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

        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];

    this.maintenanceData.map(doc => {
      let valobj = {};
      let total = {};
      let docobj = { document_type_id: 0 };
      for (var i = 0; i < this.headings.length; i++) {
        let strval = doc[this.headings[i]];
        let status = '';
        let val = 0;
        if (strval.indexOf('_') > 0) {
          let arrval = strval.split('_');
          status = arrval[0];
          val = arrval[1];
        } else {
          val = strval;
        }
        docobj.document_type_id = doc['_doctypeid'];
        valobj[this.headings[i]] = { value: val, class: (val > 0) ? 'blue' : 'black', action: val > 0 ? this.openData.bind(this, docobj, status) : '' };


      }

      columns.push(valobj);
      // columns.push(total);     
    });



    return columns;
  }

  openData(docReoprt, status) {
    this.common.params = { docReoprt, status, title: 'Document Report' };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
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
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
