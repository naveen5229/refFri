import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'voucherdetail',
  templateUrl: './voucherdetail.component.html',
  styleUrls: ['./voucherdetail.component.scss']
})
export class VoucherdetailComponent implements OnInit {
  title = '';
  voucherCode ='';
  Detail = [];
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {

      this.voucherCode = this.common.params.vchcode; 

    this.getDayBookDetailList();
    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);
  }
  ngOnDestroy(){}
ngOnInit() {
  }

  getDayBookDetailList() {
    let params = {
      voucherId: this.common.params.vchid
      
    };
    console.log('vcid', this.common.params);

    this.api.post('Company/GetVoucherDetailList', params)
      .subscribe(res => {
        // this.common.loading--;
        this.Detail = res['data'];
        console.log('Res:', this.Detail[0]['y_naration']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  filterCostDetails(unFilterData) {
    let costFilter = [];
   // console.log('Unfilter:', unFilterData);
    if (unFilterData) {
      let costStr = unFilterData.replace(/'/g, '');
      costStr = costStr.substring(1, costStr.length - 1).replace(/{/g, '').replace(/}/g, '').replace(/"/g, '');
      console.log('Cost STR:', costStr);
      let costArray = costStr.split(',');
      console.log('Cost Array:', costArray);
      costArray.map(cost => {
        costFilter.push(cost)
      })
    }

    return costFilter;


  }
  dismiss(response) {
    //console.log('Accounts:', this.Branches);
    this.activeModal.close({ response: response, test: this.Detail });
  }

}
