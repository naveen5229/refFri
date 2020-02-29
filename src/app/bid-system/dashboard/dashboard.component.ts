import { Component, OnInit } from '@angular/core';
import { AddOrderComponent } from '../../modals/BidModals/add-order/add-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { ShowBidDataComponent } from '../../modals/BidModals/show-bid-data/show-bid-data.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public user: UserService,
    public api: ApiService) {
    this.getOrders();
    this.common.refresh = this.refresh.bind(this);
  }
  refresh() {

    this.getOrders();
  }

  ngOnInit() {
  }

  getOrders() {
    this.common.loading++;
    let params = {
      x_id: null,
      loadby_id: null,
      loadby_type: null,
      status: null
    }
    this.api.post('Bidding/GetOrder', params)
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
        else if (this.headings[i] == 'Bids - Proposals') {
          console.log('action', this.headings[i]);
          // valobj[this.headings[j]] = { value: val, class: 'blue', action: this.openRouteMapper.bind(this, this.driverData[i]) };

          this.valobj[this.headings[i]] = {
            value: doc[this.headings[i]], html: true, action: this.showBidData.bind(this, doc), class: 'blue'
          };
        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
        if(doc['_is_seen']){
          console.log("HELLO");
          this.valobj['class']="makeMeYellow";
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }


  actionIcons(data) {
    let icons = [];
    if(data['Action'].isEdit){
      icons.push({
        class: " icon fa fa-pencil-square-o blue",
        action: this.openAddOrder.bind(this, data),
      });
    }
      if(data['Action'].isDelete){
        icons.push(
          {
            class: "icon fa fa-trash red",
            action: this.deleteOrder.bind(this, data),
          
        });
      
    }

    return icons;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  openAddOrder(data?) {

    let params = {
      id: data ? data._id : null,
      title:data && data._id ? 'Update Order' : 'Add Order'
    }
    this.common.params = { order: params }
    const activeModal = this.modalService.open(AddOrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if (data.response) {
        this.getOrders();
      }
    });
  }

  showBidData(data?) {

    let params = {
      id: data ? data._id : null,
      orderType : data._order_type
    }
    this.common.params = { order: params }
    const activeModal = this.modalService.open(ShowBidDataComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if (data.response) {
        this.getOrders();
      }
    });
  }

  deleteOrder(doc) {
    let params = {
      entityId: doc._id,
      entityType:'order'
    };
    if (doc._id) {
      this.common.params = {
        title: 'Delete Record',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Order' + `<b>`,
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

}
