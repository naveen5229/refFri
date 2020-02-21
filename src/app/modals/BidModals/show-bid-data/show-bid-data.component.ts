import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'show-bid-data',
  templateUrl: './show-bid-data.component.html',
  styleUrls: ['./show-bid-data.component.scss']
})
export class ShowBidDataComponent implements OnInit {
  orderId = null;
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
    this.getBids();
   }

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
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);

    });

    return columns;
  }


  actionIcons(data) {
    let icons = [
      {
        class: " icon fa fa-check",
        action: this.openConfirmModal.bind(this, data),
      },
      // {
      //   class: "icon fa fa-eye",
      //   // action: this.vehicleReport.bind(this, kpi),
      // }

    ];

    return icons;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  openConfirmModal(data) {
    let params = {
      bidId : data._bid_id,
      orderId : this.orderId
    }
    if (!confirm("Do you want Accept this Bid ?")) {
      return;
    }
    this.common.loading++;
    this.api.post('Bidding/AcceptBid', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Sucessfully Deleted", 10000);
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
}
