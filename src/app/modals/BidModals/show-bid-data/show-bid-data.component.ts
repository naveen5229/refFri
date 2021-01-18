import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { VehicleStatusComponent } from '../../vehicle-status/vehicle-status.component';
import { AddProposalComponent } from '../add-proposal/add-proposal.component';
import { ProposalStateComponent } from '../proposal-state/proposal-state.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'show-bid-data',
  templateUrl: './show-bid-data.component.html',
  styleUrls: ['./show-bid-data.component.scss']
})
export class ShowBidDataComponent implements OnInit {
  orderId = null;
  orderType = null;
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
  data = [];
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) {
    this.orderId = this.common.params && this.common.params.order && this.common.params.order.id ? this.common.params.order.id : null;
    this.orderType = this.common.params.order.orderType;
    this.getBids();
   }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(status) {
    this.activeModal.close({ respongetBidsse: status });
  }
  getBids() {
    this.common.loading++;
    let params = "orderId="+this.orderId;
    this.api.get('Bidding/getBids?'+params)
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
        else if (this.headings[i] == 'Regno'){
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action:this.openVehicleStatus.bind(this,doc)  };
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
    let viewIconClass = data._bp_status == 1 ?"icon fa fa-eye green" : data._bp_status == -1 ?"icon fa fa-eye red" :"icon fa fa-eye gray";
    let icons = [];
    if (data['Action'].isAccept) {
      icons.push({
        class: " icon fa fa-check",
        action: this.openConfirmModal.bind(this, data,1),
      });
    }
    
    if (data['Action'].isCancel) {
      icons.push({
        class: " icon fa fa-times-circle red",
       action: this.openConfirmModal.bind(this, data,-1),
      });
    }
    
    if (data['Action'].isProposalAdd) {
      icons.push({
        class: "icon fa fa-plus",
         action: this.openProposal.bind(this, data),
      });
    }
    if (data['Action'].isProposalView) {
      icons.push({
        class: viewIconClass,
         action: this.proposalLogs.bind(this, data),
      });
    }
    return icons;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  openConfirmModal(data,status) {
    let statusString = '';
    if(status==1){
      statusString = 'Accept'
    }
    else if(status==-1){
      statusString = 'Reject'
    }
    let params = {
      bidId : data._bid_id,
      orderId : this.orderId,
      status:status
    }
    if (!confirm("Do you want " +statusString+ " this Bid ?")) {
      return;
    }
    this.common.loading++;
    this.api.post('Bidding/AcceptBid', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Action Sucessfully completed", 10000);
          this.getBids();
        }
        else{
          this.common.showError(res['data'][0].y_msg)
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  openVehicleStatus(data) {
    console.log("dataggg",data);
    if(!data._vid){
      this.common.showError('Vehicle not Available');
      return;
    }
    let params = {
      vehicleId : data._vid 
    }
    this.common.params = {data:params}
    const activeModal = this.modalService.open(VehicleStatusComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
     
    });
  }


  openProposal(data) {
    console.log("dataggg",data);
    let params = {
      id : data._bid_id,
      orderId : this.orderId,
      orderType : this.orderType
    }
    this.common.params = {bidData:params}
    const activeModal = this.modalService.open(AddProposalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if(data.response){
        this.getBids();
      }
     
    });
  }

  proposalLogs(data) {
    console.log("dataggg",data);
    let params = {
      id : data._bid_id,
      orderId : this.orderId,
      orderType : this.orderType,
      proposalId : data._bp_id
    }
    this.common.params = {bidData:params}
    const activeModal = this.modalService.open(ProposalStateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
     this.getBids();
    });
  }
}
