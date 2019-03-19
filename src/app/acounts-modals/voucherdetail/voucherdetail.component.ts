import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'voucherdetail',
  templateUrl: './voucherdetail.component.html',
  styleUrls: ['./voucherdetail.component.scss']
})
export class VoucherdetailComponent implements OnInit {
  Detail =[];
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.getDayBookDetailList();
  }
  ngOnInit() {
  }
  
  getDayBookDetailList(){
    let params = {
      voucherId: this.common.params
    };
 console.log('vcid',this.common.params);

 this.api.post('Company/GetVoucherDetailList', params)
 .subscribe(res => {
  // this.common.loading--;
   console.log('Res:', res['data']);
   this.Detail = res['data'];
 }, err => {
   this.common.loading--;
   console.log('Error: ', err);
   this.common.showError();
 });
  }
  dismiss(response) {
    //console.log('Accounts:', this.Branches);
    this.activeModal.close({ response: response,test:this.Detail});
  }

}
