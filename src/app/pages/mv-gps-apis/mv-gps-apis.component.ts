import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGpsApiUrlComponent } from '../../modals/add-gps-api-url/add-gps-api-url.component';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'mv-gps-apis',
  templateUrl: './mv-gps-apis.component.html',
  styleUrls: ['./mv-gps-apis.component.scss']
})
export class MvGpsApisComponent implements OnInit {

  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  mvGpsApiDetails = [];

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService) {
    this.getMvGpsDetails();
  }

  ngOnInit() {
  }



  getMvGpsDetails() {
    this.common.loading++;
    this.api.get('GpsData/getMvGpsDetailsWrtFo')
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.clearAllTableData();
        if (!res['data']) {
          this.common.showError("Data Not Found");
          return;
        }
        this.mvGpsApiDetails = res['data'];
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });

  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.mvGpsApiDetails[0]),
      columns: this.getColumns(this.mvGpsApiDetails, this.mvGpsApiDetails[0])
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
          column[key] = { value: "", action: null, icons: [{ class: 'far fa-edit', action: this.addEditGpsApiUrl.bind(this, item) }, { class: 'fas fa-trash', action: this.deleteGpsApiUrl.bind(this, item._id) }] }
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }
  
  addEditGpsApiUrl(gpsData?) {
    this.common.params=null;
    if (gpsData) {
      this.common.params = gpsData;
    }
    const activeModal = this.modalService.open(AddGpsApiUrlComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getMvGpsDetails();
      }
    });

  }

  deleteGpsApiUrl(rowId) {
    let params={
      rowId:rowId
    }
    this.common.loading++;
    this.api.post('GpsData/deleteMvGpsDetails', params)
      .subscribe(res => {
        --this.common.loading;
        this.common.showToast(res['msg']);
        this.getMvGpsDetails();
      },
        err => {
          --this.common.loading;
          console.error(' Api Error:', err)
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
