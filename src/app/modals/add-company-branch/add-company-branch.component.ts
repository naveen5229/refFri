import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'add-company-branch',
  templateUrl: './add-company-branch.component.html',
  styleUrls: ['./add-company-branch.component.scss']
})
export class AddCompanyBranchComponent implements OnInit {

  state = [];
  companyStatus = 'self';
  address = null;
  remark = null;
  pinCode = null;
  stateId = null;
  locId = null;
  gstIn = null;
  branchName = null;
  location = null;
  assCmpnyId = null;
  userCmpnyId = null;
  companyId = null;
  name = null;
  result = [];

  companyName = null;
  branchId = null;
  Update = false;
  add = false;

  constructor(public activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.getState();
    this.companyName = this.common.params.cmpName;
    if (this.common.params.doc) {
      this.address = this.common.params.doc.Address;
      this.remark = this.common.params.doc.Remark;
      this.gstIn = this.common.params.doc.GstIn;
      this.pinCode = this.common.params.doc['Pin Code'];
      this.branchName = this.common.params.doc['Branch Name'];
      this.name = this.common.params.doc.State;
      this.location = this.common.params.doc.City;

      this.assCmpnyId = this.common.params.doc._asscompid;
      this.userCmpnyId = this.common.params.doc._usercmpyid;
      this.branchId = this.common.params.doc._id;
      this.locId = this.common.params.doc._locid;
      this.stateId = this.common.params.doc._state_id;
      if (this.assCmpnyId != this.userCmpnyId) {
        this.companyStatus = 'Other';
        this.companyName = this.common.params.doc['Company Name'];
      }
    }
    console.log("params", this.common.params.doc);
    // this.checkCompany();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  chooseCompany(type) {
    this.companyName = this.common.params.cmpName;


  }



  addCompany() {
    if (this.common.params.flag == 'Update') {
      if (this.gstIn != null || this.pinCode != null) {
        if (this.companyStatus == 'self') {
          this.assCmpnyId = this.common.params.cmpId,
            this.userCmpnyId = this.common.params.cmpId
        } else {
          this.assCmpnyId = this.companyId,
            this.userCmpnyId = this.userCmpnyId
        }
        const params = {
          address: this.address,
          remark: this.remark,
          pinCode: this.pinCode,
          stateId: this.stateId,
          locId: this.locId,
          gstIn: this.gstIn,
          branchName: this.branchName,
          assCmpnyId: this.assCmpnyId,
          userCmpnyId: this.userCmpnyId,
          branchId: this.branchId,
        };
        ++this.common.loading;
        console.log("params", params);
        this.api.post('ManageParty/saveCompanyBranch', params)
          .subscribe(res => {
            --this.common.loading;
            if (res['data'][0].y_id > 0) {
              this.common.showToast(res['data'][0].y_msg);
              this.Update = true;
              this.activeModal.close({ response: this.Update });
            }
            else {
              this.common.showError(res['data'][0].y_msg)
            }
          },
            err => {
              --this.common.loading;
              console.error(' Api Error:', err)
            });
      } else {
        this.common.showToast("please enter Gstno/Pincode");
      }

    } else {
      if (this.gstIn != null || this.pinCode != null) {
        if (this.companyStatus == 'self') {
          this.assCmpnyId = this.common.params.cmpId,
            this.userCmpnyId = this.common.params.cmpId
        } else {
          this.assCmpnyId = this.companyId,
            this.userCmpnyId = this.common.params.cmpId
        }
        const params = {
          address: this.address,
          remark: this.remark,
          pinCode: this.pinCode,
          stateId: this.stateId,
          locId: this.locId,
          gstIn: this.gstIn,
          branchName: this.branchName,
          assCmpnyId: this.assCmpnyId,
          userCmpnyId: this.userCmpnyId,
          branchId: this.branchId,
        };
        ++this.common.loading;
        console.log("params", params);
        this.api.post('ManageParty/saveCompanyBranch', params)
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
      } else {
        this.common.showToast("please enter Gstno/Pincode");
      }

    }

  }

  getState() {
    this.api.post('Suggestion/GetState', {})
      .subscribe(res => {
        this.state = res['data'];
        console.log("state", this.state);
      },
        err => {
          console.error(' Api Error:', err)
        });
  }

  checkCompany() {
    this.api.get('ManageParty/checkCompany')
      .subscribe(res => {
        console.log(res)
      }, err => {
      });
  }

}