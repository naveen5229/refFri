import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'company-contacts',
  templateUrl: './company-contacts.component.html',
  styleUrls: ['./company-contacts.component.scss']
})
export class CompanyContactsComponent implements OnInit {

  name=null;
  CompanyId=null;
  branchs=[];
  establishmentType=null;
  companyEstablishmentType=[]
  branchId=null;
  deptName=null;
  designation=null;
  phoneNo=null;
  MobileNo=null;
  email=null;
  remark=null;
  constructor(public api:ApiService,
    public activeModal:NgbActiveModal,
    public common:CommonService) {
    this.getCompanyBranchs();
    this.getCompanyEstablishmentType();
   }

  ngOnInit() {
  }

  getCompanyBranchs() {
    this.api.get('Suggestion/getSelfBranch')
      .subscribe(res => {
        this.branchs=res['data'];
      }, err => {
      });
  }

  getCompanyEstablishmentType() {
    const params="id="+64;
    this.api.get('Suggestion/getTypeMasterList?'+params)
      .subscribe(res => {
        this.companyEstablishmentType=res['data'];
      }, err => {
      });
  }

  closeModal(){
    this.activeModal.close();
  }

  addCompanyContacts(){
    const params={
      branchId:this.branchId,
      remark:this.remark,
      name:this.name,
      estbType:this.establishmentType
    }
    ++this.common.loading;
    console.log("params", params);
    this.api.post('ManageParty/saveCmpEstablishment', params)
      .subscribe(res => {
      --this.common.loading; 
      if(res['success']){
        // this.update=true;
        // this.activeModal.close({ response: this.update });
      }    
      },
        err => {
          --this.common.loading;
          console.error(' Api Error:', err)
        });

  }

}
