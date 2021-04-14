import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { PartyLedgerMappingComponent } from '../party-ledger-mapping/party-ledger-mapping.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-company-association',
  templateUrl: './add-company-association.component.html',
  styleUrls: ['./add-company-association.component.scss']
})
export class AddCompanyAssociationComponent implements OnInit {

  associationType = [];
  branchs=[];
  branchId=null;
  assType=null;
  partySupplierCode=null;
  userSullierCode=null;
  remark=null;
  updateId=null;
  update=false;
  cmpName=this.common.params.cmpName;
  cmpId=this.common.params.cmpId;
  

  constructor(public common:CommonService,
    public activeModal:NgbActiveModal,
    public modalService: NgbModal,
    public api:ApiService) {
    console.log("params Party",this.common.params);
    if(this.common.params.cmpAssocDetail){
      this.cmpName=this.common.params.cmpAssocDetail['Company Name'];
      this.updateId=this.common.params.cmpAssocDetail._id;
      this.partySupplierCode=this.common.params.cmpAssocDetail.PartySupplierCode;
      this.userSullierCode=this.common.params.cmpAssocDetail.UserSupplierCode;
      this.remark=this.common.params.cmpAssocDetail.Remark;
      this.branchId=this.common.params.cmpAssocDetail._branchid;
      this.assType=this.common.params.cmpAssocDetail._asstype;

    }
    this.getAssociationType();
    this.getSelfBranch();
   }

  ngOnDestroy(){}
ngOnInit() {
  }

  getAssociationType() {
    this.common.loading++;
    this.api.get('Suggestion/getAssocTypeWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.associationType = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getSelfBranch() {
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', {})
      .subscribe(res => {
        this.common.loading--;
        this.branchs = res['data'];
      },
        err => {
          this.common.loading--;
          console.log(err);
        });
  }

  closeModal(){
    this.activeModal.close();
  }

  addCompanyAssociation(){
    const params = {
      remark: this.remark,
      assType:this.assType,
      partyId:this.common.params.cmpId,
      branchId: this.branchId,
      assocId:this.updateId,
      userSuppCode:this.userSullierCode,
      partySuppCode:this.partySupplierCode,
    };
    ++this.common.loading;
    console.log("params", params);
    this.api.post('ManageParty/addCompWithAssoc', params)
      .subscribe(res => {
        --this.common.loading;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.update = true;
          this.common.params = {
              partyId: res['data'][0].y_id,
              userGroupId: this.assType,

            };
            this.modalService.open(PartyLedgerMappingComponent, { size: "lg", container: "nb-layout" });
          this.activeModal.close({ response: this.update });
        }
        else {
          this.common.showError(res['data'][0].y_msg)
        }
      },
        err => {
          --this.common.loading;
          console.error(' Api Error:', err)
        });
  }

}
