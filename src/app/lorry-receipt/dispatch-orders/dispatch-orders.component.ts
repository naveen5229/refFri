import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { AddDispatchOrderComponent } from '../../modals/LRModals/add-dispatch-order/add-dispatch-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { LrGenerateComponent } from '../../modals/LRModals/lr-generate/lr-generate.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'dispatch-orders',
  templateUrl: './dispatch-orders.component.html',
  styleUrls: ['./dispatch-orders.component.scss']
})
export class DispatchOrdersComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  dispatchOrders = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  }

  constructor(public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    public api: ApiService) {
    this.getDispatchOrders();
  }

  ngOnInit() {
  }

  getDispatchOrders() {
    let params = {
      startDate: this.common.dateFormatter(this.startDate),
      endDate: this.common.dateFormatter(this.endDate)
    }
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/getDispatchOrders', params)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.dispatchOrders = res['data'];
        if (!res['data']) {
          return;
        }
        this.clearAllTableData();
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });
  }
  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.dispatchOrders[0]),
      columns: this.getColumns(this.dispatchOrders, this.dispatchOrders[0])
    };
  }
  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        if (key === 'Date') {
          headings[key]['type'] = 'date';
        }
      }
    }
    return headings;
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getColumns(list, headings) {
    let columns = [];
    list.map(item => {
      let column = {};
      for (let key in this.generateHeadings(headings)) {
        if (key == "Action") {
          column[key] = { value: "", action: null, icons: this.actionIcons(item) }
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }


  actionIcons(item) {
    let icons = [
      { class: 'fa fa-print', action: this.printDispatchOrder.bind(this, item) },
      { class: item._lrid ? '' : 'fa fa-list', action: this.openGenerateLr.bind(this, item) }
    ];
    this.user.permission.edit && icons.push({ class: 'fa fa-edit', action: this.openDispatchOrder.bind(this, item) });
    this.user.permission.delete && icons.push({ class: 'fas fa-trash-alt', action: this.deleteDispatchOrder.bind(this, item) });

    return icons;
  }

  deleteDispatchOrder(dispatchOrder) {
    this.common.params = {
      title: 'Delete  ',
      description: `<b>` + 'Are you Sure To Delete This Record' + `<b>`,
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
        this.common.loading++;
        this.api.post('LorryReceiptsOperation/deleteDispatchOrders', { dispatchOrderId: dispatchOrder._dispatchid, vehicleId: dispatchOrder._vid })
          .subscribe(res => {
            this.common.loading--;
            console.log("response:", res);
            if (res['data'][0].r_id > 0) {
              this.common.showToast("Sucessfully Deleted", 10000);
              this.getDispatchOrders();
            }
          }, err => {
            this.common.loading--;
            console.log(err);
          });
      }
    });
  }





  clearAllTableData() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    }
  }

  openDispatchOrder(dispatchOrder) {
    let dispatchOrderData = null;
    if (dispatchOrder) {
      dispatchOrderData = {
        id: dispatchOrder._dispatchid
      }
    } else {
      dispatchOrderData = false;
    }
    console.log(dispatchOrder, dispatchOrderData);

    this.common.params = { dispatchOrderData: dispatchOrderData }
    const activeModal = this.modalService.open(AddDispatchOrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getDispatchOrders();
    });
  }

  printDispatchOrder(dispatchOrder) {
    let previewData = null;
    if (dispatchOrder) {
      previewData = {
        title: 'Dispatch Order',
        previewId: null,
        refId: dispatchOrder._dispatchid,
        refType: 'DSPOD_PRT'
      }
    } else {
      previewData = false;
    }
    console.log(dispatchOrder, previewData);
    this.common.params = { previewData: previewData }
    const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  openGenerateLr(DO) {
    let lrData = {
      dispOrdId: DO._dispatchid
    }
    console.log('Data Do:', lrData);
    this.common.params = { lrData: lrData }
    const activeModal = this.modalService.open(LrGenerateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data1:', data);

    });
  }
}
