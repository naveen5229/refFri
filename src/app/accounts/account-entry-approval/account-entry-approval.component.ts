import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { ClearAdvicesComponent } from '../../modals/clear-advices/clear-advices.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';

@Component({
  selector: 'account-entry-approval',
  templateUrl: './account-entry-approval.component.html',
  styleUrls: ['./account-entry-approval.component.scss']
})
export class AccountEntryApprovalComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));
  endTime = new Date();
  requestType = 'Transfer';
  status = 2;
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
  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.getRequests();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }


  refresh() {
    this.getRequests();
  }


  getRequests() {
    if (!this.startTime || !this.endTime) {
      this.common.showError("Dates cannot be blank.");
      return;
    }

    let params = {
      startTime: this.common.dateFormatter(this.startTime),
      endTime: this.common.dateFormatter(this.endTime),
      status: this.status,
      requestType: this.requestType
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('Accounts/getApprovalList', params)
      .subscribe(res => {
        --this.common.loading;

        this.data = [];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};

        if (!res['data']) return;
        this.data = res['data'];
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
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }

      //----Action-------
      this.valobj['Action'] = { class: '', icons: this.actionIcon(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  actionIcon(row) {
    let actionIcons = [];
    if (row['Status'] == 'Approved') {
      actionIcons.push(
        {
          class: "fa fa-eye icon i-gray",
          action: this.viewTransfer.bind(this, row),
        },
        {
          class: "fa fa-undo icon  i-red-cross",
          action: this.takeAction.bind(this, row, 0),
        });
    }
    else {
      actionIcons.push(
        {
          class: "fa fa-eye icon i-gray",
          action: this.viewTransfer.bind(this, row),
        },
        {
          class: "fa fa-check icon i-green",
          action: this.takeAction.bind(this, row, 1),
        },
        {
          class: "fa fa-times icon  i-red-cross",
          action: this.takeAction.bind(this, row, -1),
        });
    }



    return actionIcons;
  }

  openRemarkModal(row,status) {
    this.common.params = { title: 'Remarks ' }
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("dta", data);
      if (data.response) {
        let params = {
          requestId: row._id,
          requestType: row.Type,
          status: status,
          remarks:data.remark
        }
        this.requestApproval(params)
      }
    });
  }



  viewTransfer(row) {
    if (row.Type == 'Transfer') {
      let refData = {
        transferId: row._id,
        readOnly: true,
      }
      this.common.params = { refData: refData };
      const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
      activeModal.result.then(data => {
        console.log('Date:', data);
      });
    }
    else if (row.Type == 'Invoice') {
      let previewData = {
        title: 'Invoice',
        previewId: null,
        refId: row._id,
        refType: "FRINV"
      }
      this.common.params = { previewData };

      // const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
      const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });

      activeModal.result.then(data => {
        console.log('Date:', data);
      });
    }

    else {

    }

  }


  takeAction(row, status) {
    console.log("row:", row);
    let params = {
      requestId: row._id,
      requestType: row.Type,
      status: status
    }
    if (row._id) {
      if (status == 0) {
        this.common.params = {
          title: 'Revert Request',
          description: `<b>&nbsp;` + 'Are Sure To Revert This Approval ?' + `<b>`,
        }
        const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
        activeModal.result.then(data => {
          if (data.response) {
            this.requestApproval(params);
          }
        });
      } else {
        this.openRemarkModal(row,status);
      }
    }

  }


  requestApproval(params) {
    console.log("params",params);
    this.common.loading++;
    this.api.post('Accounts/approveAccountRequest', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0]['y_id'] > 0) {
          this.common.showToast("successfully updated");
          this.getRequests();
        }
        else {
          this.common.showError(res['data'][0]['y_msg']);
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      });
   }
}















