import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FreightInvoiceRateComponent } from '../freight-invoice-rate/freight-invoice-rate.component';
import { PrintService } from '../../../services/print/print.service';

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
    public renderer: Renderer2,
    public modalService: NgbModal,
    public printService: PrintService) {

    this.invoiceId = this.common.params.invoice.id;
    this.common.handleModalSize('class', 'modal-lg', '1600');
    this.printInvoice();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
    this.renderer.addClass(document.body, 'test');
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
    let json = {
      "headers":
        [
          {
            columns: [
              {
                type: 'normal',
                col: 8,
                values: [
                  {
                    type: 'txt',
                    value: this.invoiceDetails.branch_name,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'html',
                    value: this.invoiceDetails.branch_address,
                    fontSize: '14px',
                    fontWeight: 500,
                    align: 'left',
                    color: '#000',
                    class: '',
                  }
                ].filter(value => { return value.value })
              },
              {
                type: 'table',
                col: 4,
                values: [
                  {
                    type: 'object',
                    value: {
                      lable: 'INVOICE NO.',
                      value: this.invoiceDetails.inv_no
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'To',
                      value: this.invoiceDetails.party_name + (this.invoiceDetails.party_address ? `<address>${this.invoiceDetails.party_address}</address>` : '')
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'PAN',
                      value: this.invoiceDetails.party_pan
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'GST',
                      value: this.invoiceDetails.party_gst
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'Date',
                      value: this.invoiceDetails.inv_date
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ].filter(value => {
                  return (value.value.value === null || value.value.lable === null) ? false : true;
                })
              }
            ]
          }
        ],
      "details": [],
      "tables": [{
        "headings": this.headings.map(heading => { return { txt: heading } })
        ,
        "rows": this.columnsValue.map(row => {
          return this.headings.map(col => {
            return { txt: row[col] };
          });
        })
      }],
      "footer": {
        "left": { "name": "Powered By", "value": "Elogist Solutions" },
        "center": { "name": "Printed Date", "value": this.common.dateFormatternew(new Date(), 'ddMMYYYY').split(' ')[0] },
        "right": { "name": "Page No", "value": 1 }
      },
      "footers":
        [
          {
            columns: [
              {
                col: 8,
                type: 'normal',
                values: this.amountData.amount_words ? [
                  {
                    type: 'html',
                    value: '<strong>Amount In Words :</strong> ' + this.amountData.amount_words,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ] : []
              },
              {
                col: 4,
                type: 'table',
                values: [
                  {
                    type: 'object',
                    value: {
                      lable: 'Total',
                      value: this.amountData.total_amount
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: this.amountData.sgst_name,
                      value: this.amountData.sgst_value
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: this.amountData.cgst_name,
                      value: this.amountData.cgst_value
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'Advance Amount',
                      value: this.amountData.advance_amount
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                  {
                    type: 'object',
                    value: {
                      lable: 'Net Amount',
                      value: this.amountData.net_amount
                    },
                    fontSize: '14px',
                    isBold: false,
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ].filter(value => {
                  return (value.value.value === null || value.value.lable === null) ? false : true;
                })
              },
              {
                col: 12,
                type: 'normal',
                border: '1px solid #c2c2c2',
                values: [
                  {
                    type: 'html',
                    value: this.invoiceDetails.remarks,
                    fontSize: '14px',
                    fontWeight: '500',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ].filter(value => { return value.value })
              },
              {
                col: 8,
                type: 'normal',
                border: '1px solid #c2c2c2',
                values: [
                  {
                    type: 'html',
                    value: this.invoiceDetails.lr_terms,
                    fontSize: '14px',
                    fontWeight: '500',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ].filter(value => { return value.value })
              },
              {
                col: 4,
                type: 'normal',
                border: '1px solid #c2c2c2',
                values: [
                  {
                    type: 'html',
                    value: `<div>Logistic Sign</div> <div style="margin-top:100px;">Receiver Sign</div>`,
                    fontSize: '14px',
                    fontWeight: '500',
                    align: 'left',
                    color: '#000',
                    class: '',
                  },
                ]
              },
              {
                col: 12,
                border: '1px solid #c2c2c2',
                type: 'normal',
                values: [
                  {
                    type: 'txt',
                    value: this.invoiceDetails.lr_footer,
                    fontSize: '14px',
                    fontWeight: '700',
                    align: 'center',
                    color: '#000',
                    class: '',
                  },
                ].filter(value => {
                  return value.value
                })
              },
            ]
          }
        ],
    };
    this.printService.generalPrint2(json);
    // this.renderer.setElementClass(document.body, 'test', true);
    // window.print();
    // this.renderer.setElementClass(document.body, 'test', false);
  }
}
