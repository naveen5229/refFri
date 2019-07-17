import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'receive-items',
  templateUrl: './receive-items.component.html',
  styleUrls: ['./receive-items.component.scss']
})
export class ReceiveItemsComponent implements OnInit {
  wareHouseList=[];
  manifestList=[];
  manifestId=null;
  wareHouseId=null;
  lrList=[];
  data = [];
  itmeName=null;
  table=null;
  remarks=null;
  startDate=null;
  selectedLr = [{ 
    mId:null,
    uId:null,
    cmpId:null,
    refType:null,
    refId:null,
    qty:null,
  }];

  constructor(public activeModal:NgbActiveModal,
    public api:ApiService) { 
      this.getWareHouseList();
     this.getManifestList();
    }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getWareHouseList() {
    this.api.get('Suggestion/getWarehouseList')
      .subscribe(res => {
        this.wareHouseList = res['data'];
        console.log('type', this.wareHouseList);
      }, err => {
      });
  }

  getManifestList() {
    this.api.get('Suggestion/getManifestName')
      .subscribe(res => {
        this.manifestList = res['data'];
        console.log('type', this.manifestList);
      }, err => {
      });
      this.getLrList();
  }
  
  getLrList() {
   const params="manifestId=" + this.manifestId;
    this.api.get('WareHouse/getLrWrtManifest?' + params)
      .subscribe(res => {
       // this.data = res['data'] || [];
       this.lrList=[];
         this.lrList=res['data'];
        // this.table = this.setTable();
        console.log("datA", res);
      }, err => {
        console.log(err);
      });
}

selectedLrList(event,list){
  if(event.target.checked){    
    console.log("list",list);  
    this.selectedLr.push({
      mId:list.materialid,
      uId:list.unittype,
      cmpId:list.consignee_id,
      refType:11,
      refId:list.lrid,
      qty:list.qty
    }); 
    console.log("selected",this.selectedLr);
  }
  else{
    this.selectedLr.splice(list,1);
  }
}

saveLr(){
  let params = {
    itemName:this.itmeName,
    whId:this.wareHouseId,
    dttime:this.startDate,
    remarks:this.remarks,
    whDetails:JSON.stringify(this.selectedLr),
  }
  console.log("params",params);
  this.api.post('WareHouse/saveWhDetails', params)
    .subscribe(res => {

    }, err => {
    });
}
}
