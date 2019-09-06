import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFrieghtInvoiceComponent } from '../view-frieght-invoice/view-frieght-invoice.component';
import { SupportingDocComponent } from '../../LRModals/supporting-doc/supporting-doc.component';

@Component({
  selector: 'freight-invoice-rate',
  templateUrl: './freight-invoice-rate.component.html',
  styleUrls: ['./freight-invoice-rate.component.scss', '../../../pages/pages.component.css']
})
export class FreightInvoiceRateComponent implements OnInit {
  invoiceId = null;
  data = [];
  headings = [];
  valobj = {};
  columnsValue = [];
  invoiceRates = [];
  totalManualAmount = 0;
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.invoiceId = this.common.params.invoice.id? this.common.params.invoice.id:null;
    this.common.handleModalSize('class', 'modal-lg', '1500');
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
          this.calculateTotalAmount();
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
    console.log("data===", this.invoiceRates);
    ++this.common.loading;
    let params = {
      invoiceId: this.invoiceId,
      data: JSON.stringify(this.invoiceRates)
    }
    console.log("params", params);
    this.api.post('FrieghtRate/saveFreightInvoiceRates', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("----", res['data']);
        if (res['data'][0].r_id > 0) {
          console.log('Successfully Added');
          this.common.showToast('Successfully Added');
        } else {
          console.log(res['data'][0].r_msg)
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Err:', err);
      });

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

  calculateTotalAmount() {
    this.totalManualAmount = 0;
    this.invoiceRates.map(invoiceRate => {
      let json = {};
      for (let key in invoiceRate) {
        console.log("====", key);
        if (key.includes('head_')) {
          if (invoiceRate[key] && invoiceRate[key]['manualAmount']) {
            this.totalManualAmount = this.totalManualAmount + parseFloat(invoiceRate[key]['manualAmount']);
            console.log("this.totalManualAmount", this.totalManualAmount);
          }
        }
      }
    });
  }


 
}
