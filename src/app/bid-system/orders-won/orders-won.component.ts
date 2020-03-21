import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'orders-won',
  templateUrl: './orders-won.component.html',
  styleUrls: ['./orders-won.component.scss']
})
export class OrdersWonComponent implements OnInit {

  placed = [];
  placementStatus = 'unplaced';
  pendingPlacement = [];
  orderType = 'pending';




  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public user: UserService,
    public api: ApiService
  ) {
    this.common.refresh = this.refresh.bind(this);
    this.getOrderDetails();
  }
  refresh() {

    this.getOrderDetails();
  }
  ngOnInit() {
  }

 

  getOrderDetails() {
    this.common.loading++;
    let params = "type="+this.placementStatus;
    this.api.get('Bidding/GetWonOrder?'+ params)
      .subscribe(res => {
        this.common.loading--;
        //console.log('res: ', res['data'])
        console.log("test");
        if(this.placementStatus=='placed'){
         this.placed = res['data'];
        }else if(this.placementStatus=='unplaced'){
          this.pendingPlacement = res['data']
        }
      
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  selectVehicle(data,index){
    this.pendingPlacement[index]._vid = data.id;
  }

  placedVehicle(order,isPlaced){
    this.common.loading++;
    let params = {
      orderId : order._id,
      bidId : order._bid_id,
      vIds : isPlaced ? order._vid : order._vids_placed,
      isPlace :isPlaced
    }
    this.api.post('Bidding/placeUnplaceOrder',params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
       if( res['data'][0].y_id>0){
         this.common.showToast("Successfully Done");
         this.getOrderDetails();
       }
       else{
        this.common.showError(res['data'][0].y_msg);
       }
       
      
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
 

 

 
}
