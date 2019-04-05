import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BranchComponent } from '../../acounts-modals/branch/branch.component';
import { UserService } from '../../@core/data/users.service';
@Component({
  selector: 'company-branches',
  templateUrl: './company-branches.component.html',
  styleUrls: ['./company-branches.component.scss']
})
export class CompanyBranchesComponent implements OnInit {
  Branches = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.GetBranchData();
    this.common.currentPage = 'Company Branches';
  }

  ngOnInit() {
  }
  GetBranchData() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Company/GetCompanyBranch', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        this.Branches = res['data'];
        //console.log('Branches:', this.Branches);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openModal(Branches?) {

    if (Branches) {
      console.log('Branch ', Branches);
      this.common.params = Branches;
      const activeModal = this.modalService.open(BranchComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          if (Branches) {
            this.updatebranch(data.Branch, Branches.id);
            return;
          }
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(BranchComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        if (data.response) {
          this.addbranch(data.Branch);
        }
      });

    }
  }

  addbranch(branch) {
    console.log('branch:', branch);
    const params = {
      foid:123,
      name: branch.name,
      code: branch.code,
      addressline: branch.addressline,
      email: branch.email,
      exciseno: branch.exciseno,
      faxnumber: branch.faxnumber,
      gstno: branch.gstno,
      importexportno: branch.importexportno,
      isactive: branch.isactive,
      mobilenumber: branch.mobilenumber,
      panno: branch.panno,
      phonenumber: branch.phonenumber,
      remarks: branch.remarks,
      tanno: branch.tanno,
      tinno: branch.tinno,
      tollfreenumber: branch.tollfreenumber,
      taxexemptionno: branch.taxexemptionno,
      x_id: 0
    };

    console.log("finalbranch :", params)

    this.common.loading++;

    this.api.post('Company/InsertCompanyBranch', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.GetBranchData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  updatebranch(branch, rowid) {
    console.log('branch:', branch);
    const params = {
      foid: 123,
      name: branch.name,
      code: branch.code,
      addressline: branch.addressline,
      email: branch.email,
      exciseno: branch.exciseno,
      faxnumber: branch.faxnumber,
      gstno: branch.gstno,
      importexportno: branch.importexportno,
      isactive: branch.isactive,
      mobilenumber: branch.mobilenumber,
      panno: branch.panno,
      phonenumber: branch.phonenumber,
      remarks: branch.remarks,
      tanno: branch.tanno,
      tinno: branch.tinno,
      tollfreenumber: branch.tollfreenumber,
      taxexemptionno: branch.taxexemptionno,
      x_id: rowid
    };
    console.log("finalbranch :", params)
    this.common.loading++;
    this.api.post('Company/InsertCompanyBranch', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.GetBranchData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
}
