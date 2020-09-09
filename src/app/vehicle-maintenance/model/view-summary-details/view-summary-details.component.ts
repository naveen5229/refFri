import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-summary-details',
  templateUrl: './view-summary-details.component.html',
  styleUrls: ['./view-summary-details.component.scss', '../../../pages/pages.component.css']
})
export class ViewSummaryDetailsComponent implements OnInit {
  vehicleRegNo = null;
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
  jobId = null;
  vehicleId = null;
  numbers = [];
  details = [];
  items = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.jobId = this.common.params.jobId;
    this.vehicleId = this.common.params.vId;
    this.vehicleRegNo = this.common.params.vehicleRegNo;
    this.getDocumentData();

  }
  ngOnInit() {

  }
  getDocumentData() {
    this.common.loading++;

    this.api.get('VehicleMaintenance/viewSummaryDetails?jobId=' + this.jobId + "&vehicleId=" + this.vehicleId)
      .subscribe(res => {
        this.common.loading--;
        this.details = res['data'];
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
      columns.push(valobj);
      // columns.push(total);     
    });
    return columns;
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
    this.table.data.columns = this.getTableColumns(data);
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  closeModal(isFatal) {
    this.activeModal.close({ response: isFatal });
  }
}
