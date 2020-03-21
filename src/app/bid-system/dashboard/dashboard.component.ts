import { Component, OnInit } from '@angular/core';
import { AddOrderComponent } from '../../modals/BidModals/add-order/add-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { ShowBidDataComponent } from '../../modals/BidModals/show-bid-data/show-bid-data.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { GeneralModalComponent } from '../../modals/general-modal/general-modal.component';
import * as _ from "lodash";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data = [];
   orderStatesData = [];
  stateGroups = [];
  stateGroupsKeys = null;
  keyGroups = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings=null;
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
         this.orderStatesData = res['data'];
         this.routeData = res['data'];
        this.grouping('Order Status');
        this.generateTable();
        // this.table = {
        //   data: {
        //     headings: {},
        //     columns: []
        //   },
        //   settings: {
        //     hideHeader: true
        //   }
        // };
        // let first_rec = this.data[0];
        // for (var key in first_rec) {
        //   if (key.charAt(0) != "_") {
        //     this.headings.push(key);
        //     let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        //     this.table.data.headings[key] = headerObj;
        //   }
        // }



        // this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }


  generateTable() {
    this.headings  = this.getHeadings();
    this.table = {
      data: {
        headings: this.getHeadings(),
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    };
  }

  getHeadings() {
    let headings = {};
    for (var key in this.orderStatesData[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    headings['Action'] = { title: 'Action', hideSearch: true };
    return headings;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

 

  getTableColumns() {

    let columns = [];
    console.log('heading',this.headings.length);

    this.data.map(doc => {
      console.log('doc',doc);
      this.valobj = {};

      for (let key in this.getHeadings()) {
        if (key == 'Action') {
          console.log('action', key);
          this.valobj[key] = {
            value: "", action: null, html: true,
            icons: this.actionIcons(doc)

          };
        }
        else if (key == 'Bids - Proposals') {
          console.log('action', key);

          this.valobj[key] = {
            value: doc[key], html: true, action: this.showBidData.bind(this, doc), class: 'blue'
          };
        }
        else {
          this.valobj[key] = { value: doc[key], class: 'black', action: '' };
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
    if (data['Action'].isView) {
      icons.push(
        {
          class: " icon fa fa-eye gray",
          action: this.viewOrder.bind(this, data),

        });
    }
    if (data['Action'].isComplete) {
      icons.push(
        {
          class: " icon fa fa-check gray",
          action: this.openConfirmModal.bind(this, data,1),

        });
    }
    if (data['Action'].isCancel) {
      icons.push(
        {
          class: " icon fa fa-times red",
          action: this.openConfirmModal.bind(this, data,-1),

        });
    }

    return icons;
  }


  

  routeData = [];

  grouping(viewType) {
    console.log('viewType', viewType);
    this.stateGroups = _.groupBy(this.routeData, viewType);
    this.stateGroupsKeys = Object.keys(this.stateGroups);
    this.keyGroups = [];
    this.stateGroupsKeys.map(key => {
      const hue = Math.floor(Math.random() * 359 + 1);
      this.keyGroups.push({
        name: key,
        bgColor: `hsl(${hue}, 100%, 75%)`,
        textColor: `hsl(${hue}, 100%, 25%)`
      });
    });

    this.sortData(viewType);
  }


  chartData = null;
  chartDataa = null;
  chartOptions = null;
  chartColors = [];
  textColor = [];
  selectedFilterKey = "";


  sortData(viewType) {
    let data = [];
    this.chartColors = [];
    let chartLabels = [];
    let chartData = [];

    this.keyGroups.map(group => {
      console.log('group', group, 'this.stateGroups', this.stateGroups, 'group.name=', group.name, "this.stateGroups[group.name]=", this.stateGroups[group.name]);
      data.push({ group: group, length: this.stateGroups[group.name] ? this.stateGroups[group.name].length : 0 });
    });

    this.stateGroupsKeys = [];
    _.sortBy(data, ["length"]).reverse()
      .map(keyData => {
        this.stateGroupsKeys.push(keyData.group);
      });

    this.stateGroupsKeys.map(keyGroup => {
      console.log('keyGroup', keyGroup, "keyGroup.name", '"' + keyGroup.name + '"', 'this.stateGroups=', this.stateGroups, 'this.stateGroups[keyGroup.name]=', this.stateGroups[keyGroup.name]);
      this.chartColors.push(keyGroup.bgColor);
      chartLabels.push(keyGroup.name);
      chartData.push(this.stateGroups[keyGroup.name].length);
    });


    let chartInfo = this.common.pieChart(
      chartLabels,
      chartData,
      this.chartColors
    );
    this.chartData = chartInfo.chartData;
    this.chartOptions = chartInfo.chartOptions;
     this.selectedFilterKey && this.filterData(this.selectedFilterKey, viewType);
  }


  allData() {
    this.selectedFilterKey = "";
    this.filterData("All");
  }


  filterData(filterKey, viewType?) {
    if (filterKey == "All") {
      this.data = this.orderStatesData;
    } else {
      this.selectedFilterKey = filterKey;
      this.data = this.orderStatesData.filter(statesData => {
        if (statesData['Order Status'] == filterKey) return true;
        return false;
      });
    }
    console.log("this.orderStatesData ", this.data );
    this.generateTable();
  }


  openConfirmModal(data,status) {
    let statusString = '';
    if(status==1){
      statusString = 'complete'
    }
    else if(status==-1){
      statusString = 'Cancel'
    }
    let params = {
      orderId : data._id,
      status:status
    }
    if (!confirm("Do you want " +statusString+ " this Order ?")) {
      return;
    }
    this.common.loading++;
    this.api.post('Bidding/AcceptBid', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Action Sucessfully completed", 10000);
          this.getOrders();
        }
        else{
          this.common.showError(res['data'][0].y_msg)
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
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
