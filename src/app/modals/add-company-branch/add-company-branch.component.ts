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
  address = null;
  remark = null;
  pinCode = null;
  stateId = null;
  locId = null;
  gstIn = '';
  branchName = null;
  location = null;
  assCmpnyId = this.common.params.cmpId;
  userCmpnyId = this.common.params.userCmpId;
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
    console.log("ADDD", this.common.params)
    this.companyName = this.common.params.cmpName;
    if (this.common.params.doc) {
      this.address = this.common.params.doc.Address;
      this.remark = this.common.params.doc.Remark;
      this.gstIn = this.common.params.doc.GstIn ? this.common.params.doc.GstIn : '';
      this.pinCode = this.common.params.doc['Pin Code'];
      this.branchName = this.common.params.doc['Branch Name'];
      this.name = this.common.params.doc.State;
      this.location = this.common.params.doc.City;
      this.assCmpnyId = this.common.params.doc._asscompid;
      this.userCmpnyId = this.common.params.doc._usercmpyid;
      this.branchId = this.common.params.doc._id;
      this.locId = this.common.params.doc._locid;
      this.stateId = this.common.params.doc._state_id;
    }
    console.log("params", this.common.params.doc);
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
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

  addCompany() {
    var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9a-zA-Z]){1}?$/;
    if (this.branchName == null) {
      this.common.showError("Please Add Branch Name");
      return
    } else if (this.locId == null) {
      this.common.showError("Please Add City Name");
      return;
    } else if (this.gstIn != '' && !reggst.test(this.gstIn)) {
      this.common.showError('Invalid gstno Number');
      return;
    } else if (this.gstIn == '' && this.pinCode == null) {
      this.common.showError("please enter Gstno/Pincode");
    } else {
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
    }
    //   if(this.branchName!=null){
    //     if(this.locId!=null){
    //       if (this.common.params.flag == 'Update') {
    //         if (this.gstIn != null || this.pinCode != null) {
    //           const params = {
    //             address: this.address,
    //             remark: this.remark,
    //             pinCode: this.pinCode,
    //             stateId: this.stateId,
    //             locId: this.locId,
    //             gstIn: this.gstIn,
    //             branchName: this.branchName,
    //             assCmpnyId: this.assCmpnyId,
    //             userCmpnyId: this.userCmpnyId,
    //             branchId: this.branchId,
    //           };
    //           ++this.common.loading;
    //           console.log("params", params);
    //           this.api.post('ManageParty/saveCompanyBranch', params)
    //             .subscribe(res => {
    //               --this.common.loading;
    //               if (res['data'][0].y_id > 0) {
    //                 this.common.showToast(res['data'][0].y_msg);
    //                 this.Update = true;
    //                 this.activeModal.close({ response: this.Update });
    //               }
    //               else {
    //                 this.common.showError(res['data'][0].y_msg)
    //               }
    //             },
    //               err => {
    //                 --this.common.loading;
    //                 console.error(' Api Error:', err)
    //               });
    //         } else {
    //           this.common.showError("please enter Gstno/Pincode");
    //         }

    //       } else {
    //         if (this.gstIn != null || this.pinCode != null) {
    //           const params = {
    //             address: this.address,
    //             remark: this.remark,
    //             pinCode: this.pinCode,
    //             stateId: this.stateId,
    //             locId: this.locId,
    //             gstIn: this.gstIn,
    //             branchName: this.branchName,
    //             assCmpnyId: this.common.params.cmpId,
    //             userCmpnyId: this.common.params.userCmpId,
    //             branchId: this.branchId,
    //           };
    //           ++this.common.loading;
    //           console.log("params", params);
    //           this.api.post('ManageParty/saveCompanyBranch', params)
    //             .subscribe(res => {
    //               --this.common.loading;
    //               console.log("Testing")
    //               if (res['data'][0].y_id > 0) {
    //                 this.common.showToast(res['data'][0].y_msg);
    //                 this.Update = true;
    //                 this.activeModal.close({ response: this.Update });
    //               } else {
    //                 this.common.showError(res['data'][0].y_msg)
    //               }
    //             },
    //               err => {
    //                 --this.common.loading;
    //                 console.error(' Api Error:', err)
    //               });
    //         } else {
    //           this.common.showError("please enter Gstno/Pincode");
    //         }
    //       }   
    //     }else{
    //       this.common.showError("please add city")
    //     }

    //   }else{
    //     this.common.showError("please add branch Name")
    //   }
    // }
  }

}