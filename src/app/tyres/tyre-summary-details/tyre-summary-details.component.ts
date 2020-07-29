import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { InventoryComponent } from '../inventory/inventory.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'tyre-summary-details',
  templateUrl: './tyre-summary-details.component.html',
  styleUrls: ['./tyre-summary-details.component.scss', '../../pages/pages.component.css']
})
export class TyreSummaryDetailsComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 7));
  tyre = {
    tyreSummary: [],
    tyrePendingCount: [],
  }
  tables = {
    tyreSummary: {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    },
    tyrePendingCount: {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    }
  };
  typeListId = -1;

  constructor(public common: CommonService,
    public api: ApiService,
    public user: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

  getTyreSummary() {
    if (!this.startDate && !this.endDate) {
      this.common.showError("Please Enter StartDate And Enddate");
    } else if (!this.startDate) {
      this.common.showError("Please Enter StartDate")
    } else if (!this.endDate) {
      this.common.showError("Please Enter EndDate");
    } else if (this.startDate > this.endDate) {
      this.common.showError("StartDate Should Be Less Then EndDate")
    } else {
      this.common.loading++;
      let params = "mapped=" + this.typeListId + "&startDate=" + this.common.dateFormatter(this.startDate) + "&endDate=" + this.common.dateFormatter(this.endDate);
      this.api.get('tyres/getTyreInventry?' + params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          if (!res['data']) {
            return;
          }
          this.clearAllTableData();
          this.tyre.tyreSummary = res['data']['Summary'];
          console.log("tyres", this.tyre.tyreSummary);
          this.tyre.tyrePendingCount = res['data']['Result']
          this.setTable('tyreSummary');
          this.setTable('tyrePendingCount');
        },
          err => {
            this.common.loading--;
            this.common.showError(err);
          });
    }
  }

  setTable(type: 'tyreSummary' | 'tyrePendingCount') {
    this.tables[type].data = {
      headings: this.generateHeadings(type == 'tyreSummary' ? this.tyre.tyreSummary[0] : this.tyre.tyrePendingCount[0]),
      columns: this.getColumns(type == 'tyreSummary' ? this.tyre.tyreSummary : this.tyre.tyrePendingCount, type == 'tyreSummary' ? this.tyre.tyreSummary[0] : this.tyre.tyrePendingCount[0])
    };
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        if (key === 'Entry Date' || key==='Attached Date') {
          headings[key]['type'] = 'date';
        }
      }
    }
    return headings;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getColumns(list, type) {
    let columns = [];
    list.map(item => {
      let column = {};
      for (let key in this.generateHeadings(type)) {
        if (key == "Tyre Num") {
          column[key] = { value: item[key], class: 'text-blue', action: '' };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  clearAllTableData() {
    this.tables = {
      tyreSummary: {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      },
      tyrePendingCount: {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      }
    };

  }

  addInventory() {
    const activeModal = this.modalService.open(InventoryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.respose) {

        this.getTyreSummary();
      }
    });
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
        let center_heading = "Tyre Inventory";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "Customer Name::" + fodata['name'];
        let center_heading = "Report Name::" + "Tyre Inventory";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }



}
