import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { GeneralModalComponent } from '../../general-modal/general-modal.component';
import { AddBidComponent } from '../add-bid/add-bid.component';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { ProposalStateComponent } from '../proposal-state/proposal-state.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-orders',
  templateUrl: './vehicle-orders.component.html',
  styleUrls: ['./vehicle-orders.component.scss']
})
export class VehicleOrdersComponent implements OnInit {
vehicleId = null;
regno = null;
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
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    ) {
    this.common.handleModalSize('class', 'modal-lg', '1000', 'px', 1);
    this.vehicleId = this.common.params.vehicle.id;
    this.regno = this.common.params.vehicle.regno;
      this.getOrders();
  }


  ngOnDestroy(){}
ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  getOrders() {
    let url = 'Bidding/GetOpenOrder';
    let params = 'type=open_orders'+
    '&vehicleId='+this.vehicleId;
    this.common.loading++;
    this.api.get('Bidding/GetOpenOrder?' + params)
      .subscribe(res => {
        this.common.loading--;
        //console.log('res: ', res['data'])
        console.log("test");
        this.data = [];


        if (!res['data']) return;
        this.data = res['data'];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
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
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          console.log('action', this.headings[i]);
          this.valobj[this.headings[i]] = {
            value: "", action: null, html: true,
            icons: this.actionIcons(doc)
          };
        }

        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }

        if (doc['_is_seen']) {
          console.log("HELLO");
          this.valobj['class'] = "makeMeYellow";
        }
      }
      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(data) {
    let icons = [];
    if (data['Action'].isAdd) {
      icons.push({
        class: " icon fas fa-edit blue",
        action: this.openAddOrder.bind(this, data),
      });
    }
    
    if (data['Action'].isEdit) {
      icons.push({
        class: " icon fas fa-edit blue",
        action: this.openAddOrder.bind(this, data),
      });
    }
    
    if (data['Action'].isDelete) {
      icons.push(
        {
          class: " icon fa fa-trash red",
          action: this.deleteBid.bind(this, data),
        });
    }
    if (data['Action'].isView) {
      icons.push(
        {
          class: " icon fa fa-eye gray",
          action: this.viewOrder.bind(this, data),

        });
    }

    if (data['Action'].isProposalView) {
      console.log("data._bp_status", data._bp_status);
      icons.push(
        {
          class: data._bp_status == 1 ? "icon fa fa-file green" : data._bp_status == -1 ? "icon fa fa-file red" : "icon fa fa-file gray",
          action: this.proposalLogs.bind(this, data),
        });
    }



    return icons;
  }


  viewOrder(data) {

    let pram = {
      apiURL: 'Bidding/GetOrder',
      title: 'Order Details',
      params: {
        x_id: -data._id
      }
    }
    this.common.params = { data: pram };
    const activeModal = this.modalService.open(GeneralModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if (data.response) {
      }
    });
  }

  openAddOrder(data) {
    console.log("dataggg", data);
    let params = {
      id: data._id ? data._id : null,
      bidId: data._bid_id ? data._bid_id : null,
      type: 'new',
      rate: data._bid_rate,
      remarks: data._bid_remarks,
      vehicleId: data._vid,
      vehicleRegNo: data._regno,
      weight: data._bid_weight,
      bidExpDate: data._bid_expdate,
      orderType: data._order_type
    }
    this.common.params = { order: params }
    const activeModal = this.modalService.open(AddBidComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if (data.response) {
        this.getOrders();
      }
    });
  }

  deleteBid(doc) {
    let params = {
      entityId: doc._bid_id,
      entityType: 'bid'
    };
    if (doc._id) {
      this.common.params = {
        title: 'Delete Record',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Bid' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('Bidding/deleteEntity', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0].y_id > 0) {
                this.common.showToast("Successfully Deleted.");
                this.getOrders();
              }
              else {
                this.common.showError(res['data'][0].y_msg);
              }
              console.log('res', res['data']);
            }, err => {
              this.common.loading--;
              this.common.showError();
            })
        }
      })

    }
  }

  proposalLogs(data) {
    console.log("dataggg", data);
    let params = {
      id: data._bid_id,
      orderId: data._id,
      orderType: data._order_type,
      proposalId: data._bp_id
    }
    console.log("open orders proposalLogs",params);
    this.common.params = { bidData: params }
    const activeModal = this.modalService.open(ProposalStateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      this.getOrders();

    });
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
}
