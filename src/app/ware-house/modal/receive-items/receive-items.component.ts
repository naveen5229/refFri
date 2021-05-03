import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'receive-items',
  templateUrl: './receive-items.component.html',
  styleUrls: ['./receive-items.component.scss']
})
export class ReceiveItemsComponent implements OnInit {
  manifestId = null;
  wareHouseId = null;
  lrList = [];
  data = [];
  result=[];
  itmeName = this.common.params.item_name;
  remarks = null;
  startDate = new Date();
  selectedLr = [];
  selectedAll: false;
  Today=new Date();

  constructor(public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService) {
    this.getLrList();
    console.log("params", this.common.params);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getLrList() {
    const params = "manifestId=" + this.common.params.manifestId;
    this.api.get('WareHouse/getLrWrtManifest?' + params)
      .subscribe(res => {
        this.lrList = [];
        this.lrList = res['data'];
        this.lrList.map((list, index) => {
          list['item_name'] = this.common.params.item_name + "-" + (list['consignee_id']!=null?list['consignee_id']:'');
        });
        console.log("datA", this.lrList);
      }, err => {
        console.log(err);
      });
  }

  selectAll() {
    console.log('select all::::::::::::')
    if (this.selectedAll) {
      for (var i = 0; i < this.lrList.length; i++) {
        this.lrList[i].selected = true;
      }
    } else {
      for (var i = 0; i < this.lrList.length; i++) {
        this.lrList[i].selected = false;
      }
    }
    console.log('select All', this.selectAll);
  }


  saveLr() {
    let params = {
      //itemName: this.itmeName,
      whId: this.common.params.warehouseId,
      dttime: this.startDate,
      remarks: this.remarks,
      whDetails: JSON.stringify(this.lrList.filter(lrDetails => {
        if (lrDetails.selected) return true;
        return false;
      }).map(lrDetails => {
        return {
          material_id: lrDetails.materialid,
          unitype_id: lrDetails.unittype,
          company_id: lrDetails.consignee_id,
          ref_type: 11,
          ref_id: lrDetails.lrid,
          qty: lrDetails.qty,
          item_name:lrDetails.item_name
        };
      })),
    }
    if(params.whDetails.length==2){
      this.common.showToast("Please Select At Least One Row");
    }else{
      console.log('LRLIST: ', params.whDetails.length);
      console.log('LR List:', this.lrList);
       this.common.loading++;
       console.log("params", params);
       this.api.post('WareHouse/saveWhDetails', params)
         .subscribe(res => {
           if (res['data'][0].y_id > 0) {
             this.common.loading--;
             this.common.showToast(res['data'][0].y_msg);
             this.result = res['data'];
             this.activeModal.close({ response: this.result });
           }
           else {
             this.common.loading--;
             this.common.showError(res['data'][0].y_msg)
           }
         }, err => {
         });

    }
   
  }
}
