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

  name = null;
  CompanyId = null;
  branchs = [];
  establishmentType = null;
  companyEstablishmentType = []
  branchId = null;
  deptName = null;
  designation = null;
  phoneNo = null;
  MobileNo = null;
  email = null;
  remark = null;
  assCmpnyId = null;
  contactId = null;
  establishment=null;
  companyName = null;
  Update = false;
  constructor(public api: ApiService,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    this.companyName = this.common.params.cmpName;
    this.assCmpnyId = this.common.params.cmpId;
    console.log("companyName", this.companyName);
    console.log("param", this.common.params.contactDetail);
    if (this.common.params.contactDetail) {
      this.branchId = this.common.params.contactDetail._branchid;
      this.MobileNo = this.common.params.contactDetail.MobNO;
      this.phoneNo = this.common.params.contactDetail.PhoneNO;
      this.remark = this.common.params.contactDetail.Remark;
      this.assCmpnyId = this.common.params.contactDetail._asscompid;
      this.establishmentType = this.common.params.contactDetail._estabid;
      this.name = this.common.params.contactDetail.Name;
      this.email = this.common.params.contactDetail.Email;
      this.designation = this.common.params.contactDetail.Designation;
      this.deptName = this.common.params.contactDetail['Dept Name'];
      this.contactId = this.common.params.contactDetail._id;
      this.establishment=this.common.params.contactDetail['Estab Name']
    }
    this.getCompanyBranchs();
    this.getCompanyEstablishmentType();
  }

  ngOnInit() {
  }

  getCompanyBranchs() {
    let params = "assocCmpId=" + this.assCmpnyId;
    this.api.get('Suggestion/getSelfBranch?' + params)
      .subscribe(res => {
        this.branchs = res['data'];
      }, err => {
      });
  }

  getCompanyEstablishmentType() {
    let params = "partyId=" + this.assCmpnyId;
    this.api.get('Suggestion/getPartyEstablishment?' + params)
      .subscribe(res => {
        this.companyEstablishmentType = res['data'];
      }, err => {
        console.error(' Api Error:', err);
      });
  }

  changeEstablishmentType(estType) {
    this.establishmentType = this.companyEstablishmentType.find((element) => {
      console.log(element.name == estType);
      return element.id == estType.id;
    }).id;
  }



  closeModal() {
    this.activeModal.close();
  }

  addCompanyContacts() {
    console.log("mobile no",this.MobileNo.length);
    if (this.name == null) {
      this.common.showError("please add contact name");
    } else if (this.phoneNo == null && this.MobileNo==null) {
      this.common.showError("please add Phone no/MObile No")
    }else if(this.MobileNo!=null && this.MobileNo.length!=10){
      this.common.showError("Invalid Mobile No")
    } 
    else {
      const params = {
        branchId: this.branchId,
        remark: this.remark,
        name: this.name,
        estbId: this.establishmentType,
        deptName: this.deptName,
        designation: this.designation,
        phoneNo: this.phoneNo,
        mobNo: this.MobileNo,
        email: this.email,
        assCmpnyId: this.assCmpnyId,
        contactId: this.contactId
      }
      ++this.common.loading;
      console.log("params", params);
      this.api.post('ManageParty/saveCompContacts', params)
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

}
