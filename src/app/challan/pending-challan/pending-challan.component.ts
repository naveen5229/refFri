import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { PdfViewerComponent } from '../../generic/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'pending-challan',
  templateUrl: './pending-challan.component.html',
  styleUrls: ['./pending-challan.component.scss']
})
export class PendingChallanComponent implements OnInit {
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 30));
  challanStatus = '-1';
  challan = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  pdfUrl = '';

  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal, ) {

  }

  ngOnInit() {
  }


  getPendingChallans() {
    if (!this.startDate && !this.endDate) {
      this.common.showError("Please Enter StartDate and EndDate");
    } else if (!this.startDate) {
      this.common.showError("Please Enter StartDate");
    } else if (!this.endDate) {
      this.common.showError("Please Enter EndDate");
    } else if (this.startDate > this.endDate) {
      this.common.showError("StartDate Should be less Then EndDate")
    } else {
      let params = "fromTime=" + this.common.dateFormatter(this.startDate) + "&toTime=" + this.common.dateFormatter(this.endDate) + "&viewType=" + this.challanStatus;
      this.common.loading++;
      this.api.get('RcDetails/getPendingChallans?' + params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          this.clearAllTableData();
          if (!res['data']) {
            this.common.showError("Data Not Found");
            return;
          }
          this.challan = res['data'];
          this.setTable();
        },
          err => {
            this.common.loading--;
            this.common.showError(err);
          });
    }

  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.challan[0]),
      columns: this.getColumns(this.challan, this.challan[0])
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
          column[key] = { value: "", action: null, icons: [{ class: 'far fa-file-alt', action: this.paymentDocImage.bind(this, item._ch_doc_id) }, { class: 'far fa-file-pdf', action: this.paymentDocImage.bind(this, item._payment_doc_id) }] };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  paymentDocImage(paymentId) {
    if (paymentId) {
      this.pdfUrl = '';
      let params = "docId=" + paymentId;
      this.common.loading++;
      this.api.get('Documents/getRepositoryImages?' + params)
        .subscribe(res => {
          this.common.loading--;
          console.log(res['data']);
          if (res['data']) {
            this.pdfUrl = res['data'][0]['url'];
            this.common.params = { pdfUrl: this.pdfUrl, title: "Challan" };
            console.log("params", this.common.params);
            this.modalService.open(PdfViewerComponent, {
              size: "lg",
              container: "nb-layout"
            });
          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
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
