import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { AddBidComponent } from '../../modals/BidModals/add-bid/add-bid.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { AddOrderComponent } from '../../modals/BidModals/add-order/add-order.component';
import { GeneralModalComponent } from '../../modals/general-modal/general-modal.component';

@Component({
  selector: 'open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {  data = [];
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
  orderType = 'open';
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public user: UserService,
    public api: ApiService) {
    this.getOrders(this.orderType);
    this.common.refresh = this.refresh.bind(this);
  }
  refresh() {

    this.getOrders(this.orderType);
  }

  ngOnInit() {
  }

  getOrders(ord_type) {
    let url = 'Bidding/GetOpenOrder';
    let params = 'type=open_orders';
    if(ord_type == 'bid'){
      params = 'type=your_bids';
    }
    this.common.loading++;
    this.api.get('Bidding/GetOpenOrder?'+params)
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
      }
      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(data) {
    let icons = [];
    if(this.orderType != 'bid')
    icons = [{
        class: " icon fa fa-pencil-square-o blue",
        action: this.openAddOrder.bind(this, data),
      },
      {
        class: " icon fa fa-eye gray",
        action: this.viewOrder.bind(this, data),
      },
     
    ];
    else if(this.orderType == 'bid' && data['Bid Status']=='Pending')
    icons = [
      {
        class: " icon fa fa-pencil-square-o blue",
        action: this.openAddOrder.bind(this, data),
      },
      {
        class: " icon fa fa-trash red",
        action: this.deleteBid.bind(this, data),
      },
      {
        class: " icon fa fa-eye gray",
        action: this.viewOrder.bind(this, data),
      },
     
    ];
    else{
      icons = [
        {
          class: " icon fa fa-eye gray",
        action: this.viewOrder.bind(this, data),
        }]
    }


    return icons;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  viewOrder(data) {

    let pram = {
      apiURL : 'Bidding/GetOrder',
      title : 'Order Details',
      params : {
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
    
    let params = {
      id: data._id ? data._id : null,
      bidId : data._bid_id ? data._bid_id : null,
      type : this.orderType == 'bid' ? 'update' : 'new',
      rate : data._bid_rate ? data._bid_rate : null,
      remarks : data._bid_remarks ? data._bid_remarks :null
    }
    this.common.params = {order:params}
    const activeModal = this.modalService.open(AddBidComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if (data.response) {
        this.getOrders(this.orderType);
      }
    });
  }

  deleteBid(doc) {
    let params = {
      entityId: doc._id,
      entityType:'bid'
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
                this.refresh();
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
}
