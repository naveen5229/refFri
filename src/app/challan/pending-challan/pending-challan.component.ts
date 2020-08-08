import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { PdfViewerComponent } from '../../generic/pdf-viewer/pdf-viewer.component';
import { ChallanPendingRequestComponent } from '../../modals/challanModals/challan-pending-request/challan-pending-request.component';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';

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
  paidChallan = 0;
  pendingChallan = 0;
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
    private modalService: NgbModal,) {

  }

  ngOnInit() {
  }


  getPendingChallans() {
    this.challan = [];
    if (!this.startDate && !this.endDate) {
      this.common.showError("Please Enter StartDate and EndDate");
    } else if (!this.startDate) {
      this.common.showError("Please Enter StartDate");
    } else if (!this.endDate) {
      this.common.showError("Please Enter EndDate");
    } else if (this.startDate > this.endDate) {
      this.common.showError("StartDate Should be less Then EndDate")
    } else {
      let params = "fromTime=" + this.common.dateFormatter(this.startDate) + "&toTime=" + this.common.dateFormatter(this.endDate) + "&viewType=" + this.challanStatus + "&appType=" + 'dashboard';
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
          this.pendingChallan = 0;
          this.paidChallan = 0;
          for (let i = 0; i < this.challan.length; i++) {
            if (this.challan[i]['Payment Type'] == 'Cash')
              this.paidChallan++;
            else
              this.pendingChallan++;
          }
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
        if (key === 'Challan Date') {
          headings[key]['type'] = 'date';
        }
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
          column[key] = {
            value: "", action: null, icons: [{ class: item._ch_doc_id ? 'far fa-file-alt' : 'far fa-file-alt text-color', action: this.paymentDocImage.bind(this, item._ch_doc_id) }, { class: item._payment_doc_id ? 'far fa-file-pdf' : 'far far fa-file-pdf text-color', action: this.paymentDocImage.bind(this, item._payment_doc_id) },
            { class: item['Payment Type'] == 'Pending' && item._ch_doc_id && item._req_status == 0 ? 'far fa-money-bill-alt' : '', action: this.challanPendingRequest.bind(this, item) },]
          };
        } else if (key == "Challan Date") {
          column[key] = { value: item[key], class: 'black', action: '' };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  challanPendingRequest(challan) {
    this.common.params = {
      regNo: challan.Regno,
      chDate: challan['Challan Date'],
      chNo: challan['Challan No'],
      amount: challan.Amount,
      rowId: challan._id,
    }
    const activeModal = this.modalService.open(ChallanPendingRequestComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getPendingChallans();
      }
    });

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


  lastchecked(){
      let dataparams = {
        view: {
          api: 'Challans/getPendingLastCheckedReport',
          param: {}
        },
        
        title: 'Last Checked Report '
      }
      this.common.handleModalSize('class', 'modal-lg', '1100');
      this.common.params = { data: dataparams };
      const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    }

}
