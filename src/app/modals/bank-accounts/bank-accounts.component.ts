import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit {

  accountNo = null;
  ifscCode = null;
  assCmpnyId = this.common.params.cmpId;
  userCmpnyId = this.common.params.userCmpId;
  branchs = [];
  bankBranch = null;
  partyId=null;
  remark = null;
  bankAccId=null;
  bankId=null;
  banks=[];
  update=false;
  bankName=null;

  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal) {
      this.getCompanyBranchs();
      this.getCompanyBanks();
      console.log("bank details",this.common.params.bankDetails)
      if (this.common.params.bankDetails) {
        this.accountNo = this.common.params.bankDetails['Account No'];
        this.remark = this.common.params.bankDetails.Remark;
        this.assCmpnyId = this.common.params.bankDetails._party_id;
        this.userCmpnyId = this.common.params.bankDetails._user_company_id;
        this.bankId = this.common.params.bankDetails._bank_id;
        this.bankAccId = this.common.params.bankDetails._id;
        this.partyId = this.common.params.bankDetails._party_id;
        this.ifscCode = this.common.params.bankDetails['Ifsc Code'];
        this.bankName = this.common.params.bankDetails['Bank Name'];
        this.bankBranch = this.common.params.bankDetails['Bank Branch'];
      }
     }

  ngOnInit() {
  }



  closeModal() {
    this.activeModal.close();
  }

  getCompanyBranchs() {
    let params = "assocCmpId=" + this.assCmpnyId + "&userCmpId=" + this.userCmpnyId;
    this.api.get('Suggestion/getSelfBranch?' + params)
      .subscribe(res => {
        this.branchs = res['data'];
      }, err => {
      });
  }

  getCompanyBanks() {
    this.api.get('Suggestion/getMasterBankList')
      .subscribe(res => {
        console.log("items",res);
        this.banks = res['data'];
      }, err => {
        console.log(err);
      });
  }

  changeBank(bank) {
    this.bankId = this.banks.find((element) => {
      console.log(element.bank_name == bank);
      return element.id == bank.id;
    }).id;
  }


  addPartyAccount() {
    if (this.bankId == null) {
      this.common.showError("Please Add Bank Name");
    } else if (this.accountNo==null) {
      this.common.showError("Please Add Account No")
    }else if(this.bankBranch==null){
      this.common.showError("Please Add Bank Branch") 
    }
    else {
      const params = {
        bankId:this.bankId,
        bankBranch:this.bankBranch,
        remark:this.remark,
        accountNo:this.accountNo,
        partyBranchId:this.partyId,
        ifscCode:this.ifscCode,
        bankAccId:this.bankAccId,
        partyCmpId:this.assCmpnyId,
        userCmpId:this.userCmpnyId,
       
      }
      console.log("bank",params)
      ++this.common.loading;
      console.log("params", params);
      this.api.post('ManageParty/savePartyBankDetails', params)
        .subscribe(res => {
          --this.common.loading;
          console.log("Testing")
          if (res['data'][0].y_id > 0) {
            this.common.showToast(res['data'][0].y_msg);
            this.update = true;
            this.activeModal.close({ response: this.update });
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
