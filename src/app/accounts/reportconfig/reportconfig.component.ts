import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'reportconfig',
  templateUrl: './reportconfig.component.html',
  styleUrls: ['./reportconfig.component.scss']
})
export class ReportconfigComponent implements OnInit {
  reportList=[];
  orderno=[];
  isset=[];
  trailordr=[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
   
    this.getRportList();
    this.common.currentPage = 'Report Configure';
    }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    this.getRportList();
  }
  getRportList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Accounts/GetReportConfig', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.reportList = res['data'];
          this.reportList.map((dd,index)=>{
            this.orderno[index]=dd.balsht_ord;
            this.trailordr[index]=dd.trialbal_ord;
            this.isset[index]=dd.balsht_isasset;
          })
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  
  changevalue(id,value,isset,trial){
    console.log('set data',id,value,isset);
    let params = {
      id: id,
      orno:value,
      isset:isset,
      trial:trial
    };
    this.common.loading++;
    this.api.post('Accounts/updateReportConfig', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.common.showToast('Updated Successfully')
       this.getRportList();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
}
