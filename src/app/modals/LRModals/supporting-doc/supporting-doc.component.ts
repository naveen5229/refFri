import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'supporting-doc',
  templateUrl: './supporting-doc.component.html',
  styleUrls: ['./supporting-doc.component.scss']
})
export class SupportingDocComponent implements OnInit {

  invoiceId = null;
  invoiceDetails = null;
  particulars = null;
  type = 2;
  typeId = null;
  data = [];
  headings = [];
  valobj = {};
  columnsValue = [];
  invoiceType = null;
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2
  ) { 
    this.invoiceId = this.common.params.invoice.id;
    this.invoiceType = this.common.params.invoice.type;
    this.typeId = this.common.params.invoice.typeId?this.common.params.invoice.typeId:'null';
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.supportDoc();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
    this.renderer.addClass(document.body, 'test');
  }

  supportDoc()
  {
    ++this.common.loading;
    let params = {
      invoiceId: this.invoiceId,
      typeId:this.typeId,
      printType: this.type,
      invoiceType:this.invoiceType
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getFrieghtInvoiceData', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];
        this.invoiceDetails = res['data'].invoicedetails[0];
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
    this.renderer.addClass(document.body, 'test');
    window.print();
    this.renderer.addClass(document.body, 'test');
  }
}
