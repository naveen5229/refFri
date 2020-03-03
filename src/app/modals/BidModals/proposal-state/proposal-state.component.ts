import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { AddProposalComponent } from '../add-proposal/add-proposal.component';

@Component({
  selector: 'proposal-state',
  templateUrl: './proposal-state.component.html',
  styleUrls: ['./proposal-state.component.scss']
})
export class ProposalStateComponent implements OnInit {
  bidId = null;
  orderId = null;
  orderType = null;
  proposalId = null;
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
  constructor(public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
      this.bidId = this.common.params.bidData.id;
      this.orderId = this.common.params.bidData.orderId;
      this.orderType = this.common.params.bidData.orderType;
      this.proposalId = this.common.params.bidData.proposalId;
      console.log('proposal state ', this.orderType,this.common.params.bidData);
      this.getProposalLogs();
     }

  ngOnInit() {
  }

  closeModal(status) {
    this.activeModal.close({ respongetBidsse: true });
  }
  getProposalLogs() {
    this.common.loading++;
    let params = "orderId="+this.orderId+
    "&bId="+this.bidId;
    this.api.get('Bidding/getProposals?'+params)
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
    let icons = [
      {
        class: "icon fa fa-plus",
        //  action: this.openPrposal.bind(this, data),
      },
      {
        class: " icon fa fa-check",
        // action: this.openConfirmModal.bind(this, data),
      },
      

    ];

    return icons;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  openConfrimModal(status) {
    let url = 'Bidding/actionOnProposal';
    let statusString = '';
    let params = {
      orderId : this.orderId,
      bid:this.bidId,
      proposalId:this.proposalId,
      status:status
    }
    
    if(status==-1){
      statusString = 'Reject';
    }else if(status==1){
      statusString = 'Accept';
    }
    
    if (!confirm("Do you want " +statusString+ " this Proposal ?")) {
      return;
    }
    this.common.loading++;
    this.api.post(url, params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Sucessfully completed", 10000);
          this.closeModal({response:true});
          // this.getProposalLogs();
        }
        else{
          this.common.showError(res['data'][0].y_msg)
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  openAddPrposalModal() {
    let params = {
      id : this.bidId,
      orderId : this.orderId,
      orderType : this.orderType
    }
    console.log(' openAddPrposalModal', params);
    this.common.params = {bidData:params}
    const activeModal = this.modalService.open(AddProposalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if(data.response){
        this.closeModal({response:true});
        // this.getProposalLogs();
      }
     
    });
  }


  
}
