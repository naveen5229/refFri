import { Component, OnInit, Renderer } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-frieght-invoice',
  templateUrl: './view-frieght-invoice.component.html',
  styleUrls: ['./view-frieght-invoice.component.scss']
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
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer
  ) {

    this.invoiceId = this.common.params.invoiceId;
    this.common.handleModalSize('class', 'modal-lg', '820');
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
      type: this.type
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
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);
  }

  findCustomFields(customFields) {
    console.log("customFields", customFields)
    if (!customFields) return [];
    //customFields = JSON.parse(customFields);
    let formattedFields = [];
    let keys = Object.keys(customFields);
    keys.map(key => {
      formattedFields.push({ name: key, value: customFields[key] });
    });

    console.log('Formatted :', formattedFields);
    return formattedFields;
  }



}
