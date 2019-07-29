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
      this.valobj['Action'] = { class: '', icons: this.freightDelete(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  freightDelete(row) {

    let icons = [];

    icons.push(
      {
        class: "far fa-eye",
        action: this.lrAssign.bind(this, row),
      },

      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      },
      {
        class: "fas fa-print",
        action: this.printInvoice.bind(this, row),
      }
    )
    return icons;
  }
  deleteRow(row) {
    console.log("row:", row);
    let params = {
      id: row._id,
      partyId: row._party_id,
      branchId: row._branch_id

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
              this.common.showToast(res['msg']);
              this.viewFreightInvoice();

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



  invoice() {
    const activeModal = this.modalService.open(FreightInvoiceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.viewFreightInvoice();
    });
  }

  printInvoice(invoice) {
    console.log("invoice", invoice);
    this.common.params = { invoiceId: invoice._id }
    const activeModal = this.modalService.open(ViewFrieghtInvoiceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
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


}
