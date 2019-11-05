import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { AddFreightRevenueComponent } from '../../modals/FreightRate/add-freight-revenue/add-freight-revenue.component';
import { FreightInvoiceComponent } from '../../modals/FreightRate/freight-invoice/freight-invoice.component';
import { LrAssignComponent } from '../../modals/LRModals/lr-assign/lr-assign.component';
import { ViewFrieghtInvoiceComponent } from '../../modals/FreightRate/view-frieght-invoice/view-frieght-invoice.component';
import { LrInvoiceColumnsComponent } from '../lr-invoice-columns/lr-invoice-columns.component';
import { SupportingDocComponent } from '../../modals/LRModals/supporting-doc/supporting-doc.component';
import { AddFieldComponent } from '../../modals/LRModals/add-field/add-field.component';
import { AssignUserTemplateComponent } from '../../modals/assign-user-template/assign-user-template.component';
import { FreightInvoiceRateComponent } from '../../modals/FreightRate/freight-invoice-rate/freight-invoice-rate.component';
import { ViewMVSFreightStatementComponent } from '../../modals/FreightRate/view-mvsfreight-statement/view-mvsfreight-statement.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';

@Component({
  selector: 'freight-invoices',
  templateUrl: './freight-invoices.component.html',
  styleUrls: ['./freight-invoices.component.scss', '../pages.component.css']
})
export class FreightInvoicesComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));
  endTime = new Date();
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
    private modalService: NgbModal) {
    this.viewFreightInvoice();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }


  refresh() {
    this.viewFreightInvoice();
  }


  viewFreightInvoice() {
    if (!this.startTime || !this.endTime) {
      this.common.showError("Dates cannot be blank.");
      return;
    }

    let params = {
      startTime: this.common.dateFormatter(this.startTime),
      endTime: this.common.dateFormatter(this.endTime)
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/getInvoices', params)
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
      //-----invoice------
      this.valobj['Follow Up'] = { class: '', icons: this.invoiceIcon(doc) };
      // this.valobj['invoice2'] = { class: '', icons: this.invoiceIcon(doc,2) };
      // this.valobj['invoice3'] = { class: '', icons: this.invoiceIcon(doc,3) };

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
    if(!row._islocked){
    actionIcons.push(
      {
        class: "far fa-eye",
        action: this.lrAssign.bind(this, row),
      },
      {
        class: "far fa-edit",
        action: this.invoice.bind(this, 'Edit', row),
      },

      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      }
    );}
    if (row._lrcount > 0) {
      actionIcons.push({
        class: "fas fa-print",
        action: this.printInvoice.bind(this, row, row._invtype),
      },
        {
          class: "far fa-file",
          action: this.supportDoc.bind(this, row, row._invtype),

        },
        {
          class: "fa fa-inr",
          action: this.openFreightRateModal.bind(this, row, 1),
        }
      )
    }

    // if lr count is greater than zero

    return actionIcons;
  }

  invoiceIcon(row) {
    let invAmt = 0;
    let invoiceIcons = [];
    if (row._invtype == 1 && row._lrcount > 0) {
      invoiceIcons.push(
        {
          class: "fa fa-plus",
          action: this.invoice.bind(this, 'add', row, 2),
        },
        {
          class: "fa fa-plus",
          action: this.invoice.bind(this, 'add', row, 3),
        }
      )
    }

    return invoiceIcons;
  }

  deleteRow(row) {
    console.log("row:", row);
    let params = {
      id: row._id,
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FrieghtRate/deleteInvoices', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0]['r_id']) {
                this.common.showToast("Deleted successfully");
                this.viewFreightInvoice();
              }
              else {
                this.common.showError(res['data'][0]['r_msg']);
              }
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }


  lrAssign(row) {
    this.common.handleModalSize('class', 'modal-lg', '1300');
    this.common.params = { row: row };
    const activeModal = this.modalService.open(LrAssignComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Date:', data);
      if (data) {
        this.viewFreightInvoice();
      }
    });
  }



  invoice(title, row, type?) {
   let invoiceDetail={
      id:row?row._id:false,
      type:type?type:1,
      title:title
    }
    this.common.params={invoiceDetail:invoiceDetail};
    const activeModal = this.modalService.open(FreightInvoiceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.viewFreightInvoice();
    });
  }

  // printInvoice(inv, invNo) {
  //   let invoice = {
  //     id: inv._id,
  //   }
  //   this.common.params = { invoice: invoice }
  //   const activeModal = this.modalService.open(ViewFrieghtInvoiceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
  //   activeModal.result.then(data => {
  //     console.log('Date:', data);

  //   });
  // }

  printInvoice(inv, invNo) {
    let previewData = {
      title: 'Invoice',
      previewId: null,
      refId: inv._id,
      refType: "FRINV"
    }
    this.common.params = { previewData };
    console.log("invoice", inv);

    // const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });

    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }


  supportDoc(inv, invNo) {
    let invoice = {
      id: inv._id,
      type: invNo,
      typeId: inv._invtype_id
    }
    this.common.params = { invoice: invoice }
    const activeModal = this.modalService.open(SupportingDocComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);

    });
  }

  lrInvoice() {
    const activeModal = this.modalService.open(LrInvoiceColumnsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  addFoField() {
    const activeModal = this.modalService.open(AddFieldComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  openFreightRateModal(inv, invNo) {
    let invoice = {
      id: inv._id,
      parentId: inv._parentid
    }
    this.common.params = { invoice: invoice }
    const activeModal = this.modalService.open(FreightInvoiceRateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.viewFreightInvoice();
    });
  }

  
  }


