import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { ViewTransferComponent } from '../../modals/FreightRate/view-transfer/view-transfer.component';
import { EditFillingComponent } from '../../modals/edit-filling/edit-filling.component';

@Component({
  selector: 'transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss', '../pages.component.css']
})
export class TransfersComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));;
  endTime = new Date();
  transferType = -1;
  ledgerId = '';
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
  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    private modalService: NgbModal) {
    //this.viewTransfer();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }


  refresh() {
    this.viewTransfer();
  }

  ledger(ledgerData) {
    this.ledgerId = ledgerData.id;
  }

  viewTransfer() {
    const params = "startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime) + "&ledgerId=" + this.ledgerId + "&transferType=" + this.transferType;
    ++this.common.loading;

    this.api.get('FrieghtRate/getTransfers?' + params)
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
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = {
            value: "",
            action: null,
            isHTML: false,
            icons: this.actionIcons(doc)
          };
        }
        else if (this.headings[i] == "Credit To") {
          console.log("test", this.headings[i]);

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: "blue", action: this.openViewTransfer.bind(this, doc._cr_ledgerid, doc[this.headings[i]], "Credit To") }
        }
        else if (this.headings[i] == "Debit To") {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: "blue", action: this.openViewTransfer.bind(this, doc._dr_ledgerid, doc[this.headings[i]], "Debit To") }

        }
        else {

          console.log("doc index value:", doc[this.headings[i]]);
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }

      }
      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(doc) {
    // icons: [
    //   {  class:doc._islocked?'' :'fa fa-trash', action: this.deleteTransfer.bind(this, doc)}, {class:"fas fa-gas-pump", action: this.editFuelFilling.bind(this, doc)},{class:doc._islocked?'' :"fas fa-edit", action: this.editTransfer.bind(this, doc._id)}
    // ]
    let icons = [
      {
        class: "fas fa-gas-pump",
        action: this.editFuelFilling.bind(this, doc)
      },
    ];
    this.user.permission.edit && icons.push({ class: doc._islocked ? '' : "fas fa-edit", action: this.editTransfer.bind(this, doc._id) });
    this.user.permission.delete && icons.push({ class: doc._islocked ? '' : 'fa fa-trash', action: this.deleteTransfer.bind(this, doc) });

    return icons;
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  addTransfer() {

    this.common.params = { refData: null };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.viewTransfer();
    });
  }

  editTransfer(transferId?) {
    let refData = {
      transferId: transferId
    }
    this.common.params = { refData: refData };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.viewTransfer();
    });
  }

  editFuelFilling(info) {
    if (info._vid == null) {
      return this.common.showError("Vehichel id does not exist");
    }
    this.common.params = { info };
    const activeModal = this.modalService.open(EditFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      this.viewTransfer();
    });
  }
  openViewTransfer(id, title, ledgerType) {
    console.log("Id", id);
    console.log("Title:", title);
    console.log("ledgerType:", ledgerType);
    this.common.params = { ledgerId: id, title: title, ledgerType: ledgerType };
    const activeModal = this.modalService.open(ViewTransferComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      //this.viewTransfer();
    });
  }




  deleteTransfer(row) {
    console.log("row", row);
    let params = {
      id: row._id,
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete Transfer ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('FrieghtRate/deleteTransfers', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0].y_id > 0) {
                this.common.showToast('Success');
                this.viewTransfer();
              }
              else {
                this.common.showError(res['data'][0].y_msg);
              }
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }


}
