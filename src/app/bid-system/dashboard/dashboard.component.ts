import { Component, OnInit } from '@angular/core';
import { AddOrderComponent } from '../../modals/BidModals/add-order/add-order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

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
    // this.getOrders();
    this.common.refresh = this.refresh.bind(this);
  }
  refresh() {

    this.getOrders();
  }

  ngOnInit() {
  }

  getOrders(){this.common.loading++;
    let params = {
      x_id:null,
      loadby_id:null,
      loadby_type:null,
      status:null
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
      this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

    }
    this.valobj['Action'] = { class: '', icons: '' };


    columns.push(this.valobj);

  });

  return columns;
}


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  addOrder(alertMsg) {
    
    const activeModal = this.modalService.open(AddOrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.response);
      if (data.response) {
        this.getOrders();
      }
    });
  }
}
