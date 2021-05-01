import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'company-association',
  templateUrl: './company-association.component.html',
  styleUrls: ['./company-association.component.scss']
})
export class CompanyAssociationComponent implements OnInit {

  associationType=[];
  remark=null;
  website=null;
  assType=null;
  assCmpnyId=null;
  cmpName=null;
  branchs=[];
  cmpAlias=null;
  branchId=null;
  Update=false;
  name=null;
  userCmpnyId=this.common.params.cmpId;
  assocId=null;

  constructor(public activeModal:NgbActiveModal,
    public api:ApiService,
    public common:CommonService) { 
     this.getTypeMasterList();
     this.getSelfBranch();
     if(this.common.params.companyAssoc){
       this.remark=this.common.params.companyAssoc.Remark;
       this.website=this.common.params.companyAssoc.Website;
       this.cmpAlias=this.common.params.companyAssoc['Company Alias'];
       this.branchId=this.common.params.companyAssoc._branchid;
       this.assType=this.common.params.companyAssoc._asstype;
       this.name=this.common.params.companyAssoc['Company Name'];
       this.cmpName=this.common.params.companyAssoc['Company Name'];
       this.assCmpnyId=this.common.params.companyAssoc._asscompid;
       this.userCmpnyId=this.common.params.companyAssoc._usercmpyid;
       this.assocId=this.common.params.companyAssoc._id;

     }
     console.log("company",this.common.params.companyAssoc);
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(){
    this.activeModal.close();
  }


  getTypeMasterList() {
    const params="id="+63;
    this.api.get('Suggestion/getTypeMasterList?'+params)
      .subscribe(res => {
        this.associationType=res['data'];
      }, err => {
      });
  }

  getSelfBranch() {
    this.api.get('Suggestion/getSelfBranch')
      .subscribe(res => {
        this.branchs=res['data'];
      }, err => {
      });
  }

  addCompanyAssociation(){
    const params = {
      remark:this.remark,
      website:this.website,
      assType:this.assType,
      cmpName:this.cmpName,
      assCmpnyId:this.assCmpnyId,
      cmpAlias:this.cmpAlias,
      userCmpnyId:this.userCmpnyId,
      branchId:this.branchId,
      assocId:this.assocId
    };
    ++this.common.loading;
    console.log("params", params);
    this.api.post('ManageParty/addCompanyAssoc', params)
      .subscribe(res => {
      --this.common.loading; 
            console.log("Testing")
            if (res['data'][0].y_id > 0) {
              this.common.showToast(res['data'][0].y_msg);
              this.Update = true;
              this.activeModal.close({ response: this.Update });
            } else {
              this.common.showError(res['data'][0].y_msg)
            }
          },
            err => {
              --this.common.loading;
              console.error(' Api Error:', err)
            });
  }

}
