import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'freight-invoice-rate',
  templateUrl: './freight-invoice-rate.component.html',
  styleUrls: ['./freight-invoice-rate.component.scss']
})
export class FreightInvoiceRateComponent implements OnInit {
  invoiceId = null;
  invoiceType = 1;
  data = [];
  headings = [];
  valobj = {};
  columnsValue = [];
  invoiceRates = [];

  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    this.invoiceId = this.common.params.invoice.id;
    this.invoiceType = this.common.params.invoice.type;
    this.common.handleModalSize('class', 'modal-lg', '1200', 'px', 1);
    this.getFreightInvoiceRate();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getFreightInvoiceRate() {
    ++this.common.loading;
    let params = {
      invoiceId: this.invoiceId,
      invoiceType: this.invoiceType
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getFreightInvoiceRates', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];

        this.data = res['data'];
        if (this.data) {
          console.log("data", this.data);
          this.invoiceRates = this.formattInvoiceRate();
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
  }



  saveRate() {
    console.log("data", this.invoiceRates);
    let jsonArray = this.invoiceRates.map(invoiceRate => {
      let json = {};
      for (let key in invoiceRate) {
        if (key.includes('_')) {
          let heads = invoiceRate[key].split('_');
          json[key] = { headId: heads[0], autoAmount: heads[1], manualAmount: heads[2] };
        }
      }
      return json;
    });

    console.log('JSON:', jsonArray);

  }

  formattInvoiceRate() {
    let jsonArray = this.data.map(invoiceRate => {
      let json = {};
      for (let key in invoiceRate) {
        console.log('---------:', key, invoiceRate[key]);
        if (!invoiceRate[key]) {
          json[key] = null;
        } else if (key.includes('head_')) {
          let heads = invoiceRate[key].split('_');
          json[key] = { headId: heads[0], autoAmount: heads[1], manualAmount: heads[2] };
        } else {
          json[key] = invoiceRate[key];
        }
      }
      return json;
    });

    console.log('JSON:', jsonArray);
    return jsonArray;
  }
}
