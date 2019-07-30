import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoUserStateComponent } from '../../modals/fo-user-state/fo-user-state.component';
import { CommonService } from '../../services/common.service';
import { ShowMobileComponent } from '../../modals/show-mobile/show-mobile.component';
import { ViewListComponent } from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'finance-recovery',
  templateUrl: './finance-recovery.component.html',
  styleUrls: ['./finance-recovery.component.scss']
})
export class FinanceRecoveryComponent implements OnInit {
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true

    }

  };
 data=[]
  headings = [];
  valobj = {};
  financeData=[];
  constructor(public api:ApiService,
    public activeModal:NgbActiveModal,
    public modalService:NgbModal,
    public common:CommonService
    ) {
this.getFinanceData(); 
this.common.refresh = this.refresh.bind(this);
}

  ngOnInit() {
  }

  refresh() {
    this.getFinanceData(); 
  }

  getTableColumns(){
    let columns=[];
    this.financeData.map(financeDocs =>{
      this.valobj={};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          this.valobj['Action'] = { class: "fas fa-eye", action: this.showAction.bind(this,financeDocs._ledid) }

        } 
        else  if (this.headings[i] == "View Contacts") {
          this.valobj[this.headings[i]] = { value: 'show',  class: "blue", action: this.showMobile.bind(this) }
          }
        
        else {
          this.valobj[this.headings[i]] = { value: financeDocs[this.headings[i]], class: 'blue', action: '' };
        }
      }

      columns.push(this.valobj);
    });
    return columns;
  }
    
      
  showMobile(){
    // this.common.params = mobileno;
    // this.common.loading++;
    // this.api.get('FinanceRecovery/getCompanyContacts')
    //   .subscribe(res => {
    //     this.common.loading--;
    //     this.data=[]
    //     this.common.params=res['data']
    //     if (res['msg'] == "Success") {
    //       this.common.showToast("Successfully Update")
    //     }
    //     console.log('Res:', res['data']);
    //   }, err => {
    //     this.common.loading--;
    //     console.log(err);
    //   });
  
    console.log("mobile no", this.common.params);
  this.modalService.open(ShowMobileComponent, { size: "sm", container: "nb-layout"
    });
  
  }
    
  getFinanceData(){
    console.log("ap")
    const params=`branchId=${0}&accGroupId=${0}&ledgerId=${0}`
    
    this.api.get("FinanceRecovery/getOutstandingCredit?"+ params).subscribe(
      res => {
        this.financeData = [];
        this.financeData = res['data'];
        console.log("result", res);
        let first_rec = this.financeData[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        // let action = { title:this.formatTitle('Action'), placeholder:this.formatTitle('Action'),hideHeader:true}
        // this.table.data.headings['action'] = action;

        this.table.data.columns = this.getTableColumns();
      }
    );
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  
 showAction(_ledid)
 { this.common.params={
  ledgerId:_ledid
 }
 console.log("params",this.common.params)
  this.modalService.open(FoUserStateComponent, {size: "md",container: "nb-layout" }); 
 }

}
