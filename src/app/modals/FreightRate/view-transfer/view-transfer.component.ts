import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { UserService } from '../../../services/user.service';
import { PrintService } from '../../../services/print/print.service';

@Component({
  selector: 'view-transfer',
  templateUrl: './view-transfer.component.html',
  styleUrls: ['./view-transfer.component.scss']
})
export class ViewTransferComponent implements OnInit {

  startTime = new Date(new Date().setDate(new Date().getDate() - 30));;
  endTime = new Date();
  transferType = -1;
  ledgerId = '';
  ledgerType = '';

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
  params = null;

  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2,
    public modalService: NgbModal,
    public printService: PrintService,
    public user: UserService) {
    this.params = this.common.params;
    this.ledgerId = this.common.params.ledgerId;
    this.ledgerType = "Ledger:" + this.common.params.title;
    console.log("ledgerType:", this.ledgerType);
    this.common.handleModalSize('class', 'modal-lg', '1400');
    this.viewTransfer();
  }

  ngOnInit() {
  }

  viewTransfer() {
    const params = "startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime) + "&ledgerId=" + this.ledgerId;
    ++this.common.loading;

    this.api.get('FrieghtRate/getLedgerTransfers?' + params)
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
      columns.push(this.valobj);
    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  closeModal() {
    this.activeModal.close();
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        console.log("Api data", res['data']);
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "View Transfer";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printHandler() {
    let rows = [];
    this.data.map((transfer, index) => {
      let column = [];
      column.push({txt: index + 1});
      this.headings.forEach(heading => column.push({ txt: transfer[heading] !== null ? transfer[heading] : '' }));
      rows.push(column);
    });
    let xJSON1 = {
      "headers":
        [
          { "txt": this.params.title, size: '22px', weight: 'bold' },
        ],
      "details": [],
      tables: [{
        "headings":
          [{ "txt": "#" }, { "txt": "Time" }, { "txt": "Payment For" }, { "txt": "Party" },
          { "txt": "Receipt" }, { "txt": "Transfer" }, { "txt": "Balance" }, { "txt": "Remarks" }],
        "rows": rows,
        name: ''
      }],
      "signatures": [],
      "footer": {
        "left": { "name": "Powered By", "value": "Elogist Solutions" },
        "center": { "name": "Printed Date", "value": this.common.dateFormatternew(new Date(), 'ddMMYYYY').split(' ')[0] },
        "right": { "name": "Page No", "value": 1 }
      },
      footertotal: []
    };
    this.printService.generalPrint(xJSON1);
  }
}
