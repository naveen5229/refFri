import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGpsWebUrlComponent } from '../../modals/add-gps-web-url/add-gps-web-url.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { AddGpsNewRequesComponent } from '../../modals/add-gps-new-reques/add-gps-new-reques.component';

@AutoUnsubscribe()
@Component({
  selector: 'mv-gps-api-req',
  templateUrl: './mv-gps-api-req.component.html',
  styleUrls: ['./mv-gps-api-req.component.scss']
})
export class MvGpsApiReqComponent implements OnInit {

  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  challanRequest = [];
  gpsRequestType = 1;
  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getMvGpsDetails();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getMvGpsDetails();
  }
  requestTypeChange() {
    this.clearAllTableData();
    this.getMvGpsDetails();
  }



  getMvGpsDetails() {
    this.common.loading++;
    this.api.get('GpsData/getMvGpsDetails?reqType=' + this.gpsRequestType)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.clearAllTableData();
        if (!res['data']) {
          this.common.showError("Data Not Found");
          return;
        }
        this.challanRequest = res['data'];
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });

  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.challanRequest[0]),
      columns: this.getColumns(this.challanRequest, this.challanRequest[0])
    };
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getColumns(challanList, chHeadings) {
    let columns = [];
    challanList.map(item => {
      let column = {};
      for (let key in this.generateHeadings(chHeadings)) {
        if (key == "Action") {
          column[key] = { value: "", action: null, icons: [{ class: item._status == 1 ? '' : 'far fa-edit', action: item._status == 1 ? '' : this.addGpsWebUrl.bind(this, item) }] }
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }


  addGpsWebUrl(data) {
    console.log("data", data);

    let gpsData = {
      rowId: data._id,
      url: data.Url,
      supplierName: data['Supplier Name'],
      supplierId: data._supplierid
    }
    this.common.params = { gpsData };
    const activeModal = this.modalService.open(AddGpsWebUrlComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getMvGpsDetails();
      }
    });

  }


  addNewRequest(){
    const activeModal = this.modalService.open(AddGpsNewRequesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getMvGpsDetails();
      }
    });
  }


  clearAllTableData() {
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

}
