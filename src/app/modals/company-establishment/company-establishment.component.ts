import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'company-establishment',
  templateUrl: './company-establishment.component.html',
  styleUrls: ['./company-establishment.component.scss']
})
export class CompanyEstablishmentComponent implements OnInit {
 
  state=[];
  branchs=[];
  companyEstablishmentType=[];
  name=null;
  establishmentType=null;
  branchId=null;
  address=null;
  locId=null;
  stateId=null;
  pincode=null;
  location=null;
  remark=null;
  estbId=null;
  stateName=null;
  Update=false;
  constructor(public api:ApiService,
    public activeModal:NgbActiveModal,
    public common:CommonService) {
    this.getState();
    this.getCompanyBranchs();
    this.getCompanyEstablishmentType();
    console.log("establish",this.common.params.cmpEstablish)
    if(this.common.params.cmpEstablish){
      this.name=this.common.params.cmpEstablish.Name;
      this.remark=this.common.params.cmpEstablish.Remark;
      this.address=this.common.params.cmpEstablish.Address;
      this.location=this.common.params.cmpEstablish.Location;
      this.establishmentType=this.common.params.cmpEstablish._estbtype;
      this.estbId=this.common.params.cmpEstablish._id;
      this.branchId=this.common.params.cmpEstablish._branchid;
      this.locId=this.common.params.cmpEstablish._locid;
      this.stateId=this.common.params.cmpEstablish._stateid;
      this.stateName=this.common.params.cmpEstablish.State;
      this.pincode=this.common.params.cmpEstablish.PinCode;

    }
   }

  ngOnInit() {
  }

  closeModal(){
    this.activeModal.close();
  }

  getState(){
    this.api.post('Suggestion/GetState',{})
      .subscribe(res => {
        this.state=res['data'];
        console.log("state",this.state);
      },
        err => {
          console.error(' Api Error:', err)
        });
  }

  getCompanyBranchs() {
    let params="assocCmpId="+this.common.params.cmpId+"&userCmpId="+this.common.params.userCmpId;
    this.api.get('Suggestion/getSelfBranch?'+params)
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

  addCompanyEstablishment(){
    if(this.name==null){
      this.common.showToast("Please add Establishmentname")
    }
    else if(this.locId==null){
      this.common.showToast("please add city")
    }
    else{
      const params={
        branchId:this.branchId,
        locId:this.locId,
        remark:this.remark,
        name:this.name,
        stateId:this.stateId,
        pinCode:this.pincode,
        estbType:this.establishmentType,
        address:this.address,
        estbId:this.estbId,
      }
      ++this.common.loading;
      console.log("params", params);
      this.api.post('ManageParty/saveCmpEstablishment', params)
        .subscribe(res => {
          --this.common.loading; 
          console.log("Testing")
          if (res['data'][0].y_id > 0) {
            this.common.showToast(res['data'][0].y_msg);
            this.branchId = res['data'][0].y_id;
            this.activeModal.close({ response: this.branchId });
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

}
