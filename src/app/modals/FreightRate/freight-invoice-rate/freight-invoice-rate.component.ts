import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'freight-invoice-rate',
  templateUrl: './freight-invoice-rate.component.html',
  styleUrls: ['./freight-invoice-rate.component.scss', '../../../pages/pages.component.css']
})
export class FreightInvoiceRateComponent implements OnInit {
  invoiceId = null;
  invoiceType = 1;
  data = [];
  headings = [];
  valobj = {};
  columnsValue = [];
  invoiceRates = [];
  totalManualAmount = 0;
  invoiceNo = null;
  invoices = [];
  invoiceDate = new Date();
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    this.invoiceId = this.invoiceType? this.common.params.invoice.id:null;
    this.invoiceType = this.common.params.invoice.type;
    this.common.handleModalSize('class', 'modal-lg', '1500');
    this.getFreightInvoiceRate();
    this.getFollowupInvoices();
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
      invoiceType: this.invoiceType,
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
      invoiceType: this.invoiceType,
      invoiceNumber:this.invoiceNo,
      invoiceDate: this.common.dateFormatter(this.invoiceDate).split(' ')[0],
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

  //  invoices------
  valobj2 = {};
  table2 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  showTable = false;

  getFollowupInvoices() {
    let params = {
      invoiceId: this.invoiceId,
      invoiceType: this.invoiceType,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getFollowupInvoices', params)
      .subscribe(res => {
        this.common.loading--;

        console.log("result", res['data']);
        this.invoices = res['data'];
        this.smartTableWithHeadings();

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  smartTableWithHeadings() {
    this.table2 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.invoices != null) {
      console.log('onwardDelayData', this.invoices);
      let first_rec = this.invoices[0];
      console.log("first_Rec", first_rec);

      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table2.data.headings[key] = headerObj;
        }

      }

      this.table2.data.columns = this.getTableColumns2();
      console.log("table:2");
      console.log(this.table2);
      this.showTable = true;
    } else {
      this.common.showToast('No Record Found !!');
    }


  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  getTableColumns2() {
    let columns = [];
    for (var i = 0; i < this.invoices.length; i++) {
      this.valobj2 = {};

      for (let j = 0; j < this.headings.length; j++) {
        console.log("header", this.headings[j])
        if (this.headings[j] == "Act") {
          this.valobj2[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: '' },
              { class: 'icon fa fa-pencil-square-o', action: '' }]
          };

        }
        else {
          this.valobj2[this.headings[j]] = { value: this.invoices[i][this.headings[j]], class: 'black', action: '' };
        }
      }
      this.valobj2['style'] = { background: this.invoices[i]._rowcolor };
      columns.push(this.valobj2);
    }

    console.log('Columns:', columns);
    return columns;
  }

  onPrint() {

  }
}
