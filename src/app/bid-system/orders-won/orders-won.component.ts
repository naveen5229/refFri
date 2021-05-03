import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  ngOnDestroy(){}
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

  vehicles = [];
  vehicleIds = [];
  vehId = null;
  selectVehicle(data,index,_is_multi_select){
    this.vehId = null;
    if(_is_multi_select){
    this.vehicles = data;
  }
    else{
    this.vehId = data.id;
  }
  console.log('_is_multi_select',_is_multi_select,"this.vehId",this.vehId);
  }

  placedVehicle(order,isPlaced){
    let vehIds = [];
    if(this.vehicles.length>0){
    vehIds = this.vehicles.map(veh=>{
      console.log('veh',veh);
      return veh.id;
    });
  }
  else{
    isPlaced ? vehIds.push(this.vehId) :vehIds.push(order._vids_placed) ;
  }
    console.log("vehIds",vehIds);
    this.common.loading++;
    let params = {
      orderId : order._id,
      bidId : order._bid_id,
      vIds : isPlaced ? JSON.stringify(vehIds) : JSON.stringify(vehIds),
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
