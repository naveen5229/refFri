import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-mvsfreight-statement',
  templateUrl: './view-mvsfreight-statement.component.html',
  styleUrls: ['./view-mvsfreight-statement.component.scss','../../../pages/pages.component.css']
})
export class ViewMVSFreightStatementComponent implements OnInit {
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
  freightIndex=0;
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2,
    public modalService: NgbModal
  ) {
    this.freightIndex= this.common.params.freightIndex;
    this.invoiceId = this.common.params.invoice.id;
    this.common.handleModalSize('class', 'modal-lg', '1600','px',this.freightIndex);
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
    this.api.post('FrieghtRate/getMVSFrieghtStatement', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];
        this.invoiceDetails = res['data'].invoicedetails[0];
        this.amountData = res['data'].amtdetails;
        // console.log("this.invoiceDetails", this.invoiceDetails);
        this.data = res['data'].result;
        if (this.data) {
          console.log("data", this.data);
          this.getTableColumnName();
        }
        console.log("--res--",res);
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
