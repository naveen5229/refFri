import { Component, OnInit, Renderer } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'view-transfer',
  templateUrl: './view-transfer.component.html',
  styleUrls: ['./view-transfer.component.scss']
})
export class ViewTransferComponent implements OnInit {

  startTime = new Date(new Date().setDate(new Date().getDate() - 30));;
  endTime = new Date();
  transferType=-1;
  ledgerId='';
  ledgerType='';

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


  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer,
    public modalService: NgbModal
  ) 
  { 
    this.ledgerId=this.common.params.ledgerId;
    this.ledgerType="Ledger:"+this.common.params.title;
    console.log("ledgerType:",this.ledgerType);
    this.common.handleModalSize('class', 'modal-lg', '1400');
    this.viewTransfer();
  }

  ngOnInit() {
  }

  viewTransfer()
  {
    const params = "startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime)+"&ledgerId="+this.ledgerId;
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


  // deleteTransfer(row) {
  //   console.log("row", row);
  //   let params = {
  //     id: row._id,
  //   }
  //   if (row._id) {
  //     this.common.params = {
  //       title: 'Delete Route ',
  //       description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
  //     }
  //     const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
  //     activeModal.result.then(data => {
  //       if (data.response) {
  //         console.log("data", data);
  //         this.common.loading++;
  //         this.api.post('FrieghtRate/deleteTransfers', params)
  //           .subscribe(res => {
  //             this.common.loading--;
  //             if (res['data'][0].y_id > 0) {
  //               this.common.showToast('Success');
  //               this.viewTransfer();
  //             }
  //             else {
  //               this.common.showToast(res['data'][0].y_msg);
  //             }
  //           }, err => {
  //             this.common.loading--;
  //             console.log('Error: ', err);
  //           });
  //       }
  //     });
  //   }
  // }

  closeModal() {
    this.activeModal.close();
  }
}
