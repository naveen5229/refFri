import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'order-boards',
  templateUrl: './order-boards.component.html',
  styleUrls: ['./order-boards.component.scss']
})
export class OrderBoardsComponent implements OnInit {
  orders = [];
  bulkOrders = [];
  orderType = 'bulk';
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public user: UserService,
    public api: ApiService
  ) {
    this.getOrderDetails();
  }

  ngOnInit() {
  }


  getOrderDetails() {
    this.common.loading++;
    let params = {

    }
    this.api.get('Bidding/getOrderSummary', params)
      .subscribe(res => {
        this.common.loading--;
        //console.log('res: ', res['data'])
        console.log("test");
        this.orders = res['data'];
        this.bulkOrders = [{
          name: "Jaipur To Agra", tot_weight:"10000 ton", bids: [
            { bidder: "Shree Yadav", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "JRD", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "Meera Roadways", t_weight: "2000 Ton",p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "Hari mohan", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "R K ", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" }]
        },
        {
          name: "delhi To Agra", tot_weight:"10000 ton", bids: [
            { bidder: "Shree Yadav", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "JRD", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "Meera Roadways", t_weight: "2000 Ton",p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "Hari mohan", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "R K ", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" }]
        },
        {
          name: "delhi To mumbai", tot_weight:"10000 ton", bids: [
            { bidder: "Shree Yadav", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "JRD", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "Meera Roadways", t_weight: "2000 Ton",p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "Hari mohan", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" },
            { bidder: "R K ", t_weight: "2000 Ton", p_weight: '1200 Ton (60%)', r_weight: "800 Ton (40%)" }]
        }
        ]

        // [{ hours:"3 hrs",orders:"600",bids:"375 (54 %)",bids_avg:"45",placement:"300"},
        // { hours:"6 hrs",orders:"1200",bids:"1175 (56 %)",bids_avg:"56",placement:"930"},
        // { hours:"12 hrs",orders:"2435",bids:"2075 (65 %)",bids_avg:"75",placement:"1258"},
        // { hours:"24 hrs",orders:"4658",bids:"4258 (77 %)",bids_avg:"84",placement:"3687"},
        // { hours:"24-48 hrs",orders:"9875",bids:"8568 (64 %)",bids_avg:"91",placement:"7865"}];

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

}
