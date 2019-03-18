import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'voucherdetail',
  templateUrl: './voucherdetail.component.html',
  styleUrls: ['./voucherdetail.component.scss']
})
export class VoucherdetailComponent implements OnInit {
  Detail =[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
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
}
