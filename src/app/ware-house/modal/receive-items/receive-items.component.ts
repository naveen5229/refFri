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
  manifestId=null;
  wareHouseId=null;
  lrList=[];
  data = [];
  itmeName=this.common.params.item_name;
  remarks=null;
  startDate=new Date();
  selectedLr = [];
  selectedAll: false;

  constructor(public activeModal:NgbActiveModal,
    public api:ApiService,
    public common:CommonService) { 
    this.getLrList();
     console.log("params",this.common.params);
    }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }
  
  getLrList() {
   const params="manifestId=" + this.common.params.manifestId;
    this.api.get('WareHouse/getLrWrtManifest?' + params)
      .subscribe(res => {
       // this.data = res['data'] || [];
       this.lrList=[];
         this.lrList=res['data'];
        // this.table = this.setTable();
        console.log("datA", this.lrList);
      }, err => {
        console.log(err);
      });
}

selectAll() {
 if (this.selectedAll) {
    for (var i = 0; i < this.lrList.length; i++) {
     // this.vehCostList[i].selected = this.selectedAll;
     this.selectedLr.push({
      material_id:this.lrList[i].materialid,
      unitype_id:this.lrList[i].unittype,
      company_id:this.lrList[i].consignee_id,
      ref_type:11,
      ref_id:this.lrList[i].lrid,
      qty:this.lrList[i].qty
    }); 
    }
  } else {
    for (var i = 0; i < this.lrList.length; i++) {
     // this.vehCostList[i].selected = false;
      this.selectedLr = [];
    }
  }

  console.log('select All', this.selectAll);
}

selectedLrList(event,list){
  if(event.target.checked){    
    console.log("list",list);  
    this.selectedLr.push({
      material_id:list.materialid,
      unitype_id:list.unittype,
      company_id:list.consignee_id,
      ref_type:11,
      ref_id:list.lrid,
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
    whId:this.common.params.warehouseId,
    dttime:this.startDate,
    remarks:this.remarks,
    whDetails:JSON.stringify(this.selectedLr),
  }
  this.common.loading++;
  console.log("params",params);
  this.api.post('WareHouse/saveWhDetails', params)
    .subscribe(res => {
      if (res['data'][0].y_id > 0) {
        this.common.loading--;
        this.common.showToast(res['data'][0].y_msg);
      }
      else {
        this.common.loading--;
        this.common.showError(res['data'][0].y_msg)
      }
     

    }, err => {
    });
}
}
