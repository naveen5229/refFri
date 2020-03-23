import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { AddBidComponent } from '../../modals/BidModals/add-bid/add-bid.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { AddOrderComponent } from '../../modals/BidModals/add-order/add-order.component';
import { GeneralModalComponent } from '../../modals/general-modal/general-modal.component';
import { ProposalStateComponent } from '../../modals/BidModals/proposal-state/proposal-state.component';
import * as _ from "lodash";

@Component({
  selector: 'open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.scss']
})
export class OpenOrdersComponent implements OnInit {
  data = [];
  orderStatesData = [];
  stateGroups = [];
  bidData = [];
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
    if (ord_type == 'bid') {
      params = 'type=your_bids';
    }
    this.common.loading++;
    this.api.get('Bidding/GetOpenOrder?' + params)
      .subscribe(res => {
        this.common.loading--;
        //console.log('res: ', res['data'])
        console.log("test");
        this.data = [];


        if (!res['data']) return;
        this.data = res['data'];
         this.orderStatesData = res['data'];
         this.bidData = res['data'];
        this.grouping('Bid Status');
        this.generateTable();
    

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
    if (data['Action'].isAdd) {
      icons.push({
        class: " icon fa fa-pencil-square-o blue",
        action: this.openAddOrder.bind(this, data),
      });
    }

    if (data['Action'].isEdit) {
      icons.push({
        class: " icon fa fa-pencil-square-o blue",
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


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  
  grouping(viewType) {
    console.log('viewType', viewType);
    this.stateGroups = _.groupBy(this.bidData, viewType);
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
        if (statesData['Bid Status'] == filterKey) return true;
        return false;
      });
    }
    console.log("this.orderStatesData ", this.data );
    this.generateTable();
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
      type: this.orderType == 'bid' ? 'update' : 'new',
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
        this.getOrders(this.orderType);
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

  proposalLogs(data) {
    console.log("dataggg", data);
    let params = {
      id: data._bid_id,
      orderId: data._id,
      orderType: data._order_type,
      proposalId: data._bp_id
    }
    console.log("open orders proposalLogs", params);
    this.common.params = { bidData: params }
    const activeModal = this.modalService.open(ProposalStateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      this.getOrders(this.orderType);

    });
  }
}
