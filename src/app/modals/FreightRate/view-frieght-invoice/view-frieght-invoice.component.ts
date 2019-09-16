import { Component, OnInit, Renderer } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FreightInvoiceRateComponent } from '../freight-invoice-rate/freight-invoice-rate.component';

@Component({
  selector: 'view-frieght-invoice',
  templateUrl: './view-frieght-invoice.component.html',
  styleUrls: ['./view-frieght-invoice.component.scss', '../../../pages/pages.component.css']
})
export class ViewFrieghtInvoiceComponent implements OnInit {
  invoiceId = null;
  invoiceDetails = null;
  particulars = null;
  type = 1;
  data = [];
  headings = [];
  valobj = {};
  columnsValue = [];
  amountData = null;
  amountDataKeys = [];
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer,
    public modalService: NgbModal
  ) {

    this.invoiceId = this.common.params.invoice.id;
    this.common.handleModalSize('class', 'modal-lg', '1600');
    this.printInvoice();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
    this.renderer.setElementClass(document.body, 'test', false);
  }

  printInvoice() {
    ++this.common.loading;
    let params = {
      invoiceId: this.invoiceId,
      printType: this.type,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getFrieghtInvoiceData', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];
        this.invoiceDetails = res['data'].invoicedetails[0];
        this.amountData = res['data'].taxdetails[0];
        console.log("this.invoiceDetails", this.invoiceDetails);
        this.data = res['data'].result;
        if (this.data) {
          console.log("data", this.data);
          this.getTableColumnName();
        }
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTableColumnName() {
    this.headings = [];
    this.valobj = {};
    let first_rec = this.data[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
      }
    }

    console.log("headings", this.headings);
    this.getTableColumns();
  }

  getTableColumns() {
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = doc[this.headings[i]];
      }
      this.columnsValue.push(this.valobj);
    });

    console.log("this.columnsValue", this.columnsValue);
  }


  onPrint() {
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);
  }

 
}
