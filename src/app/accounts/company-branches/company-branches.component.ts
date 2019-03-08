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
    public modalService: NgbModal){  
      this.GetBranchData();
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

  openModal (Branches?) {
    // console.log('Accounts',Accounts);
       if (Branches) this.common.params = Branches;
       const activeModal = this.modalService.open(BranchComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static',keyboard :false });
       activeModal.result.then(data => {
         // console.log('Data: ', data);
         if (data.response) {
           console.log('testdata :',data.Branches);
          this.addbranch(data.ledger);
         }
       });
     }

     addbranch(branch) {
     console.log('branch:',branch);
      const params = {
        foid: branch.user.id,
        name: branch.name,
        code: branch.code,
        addressline:  branch.addressline,
        email:  branch.email,
        exciseno:  branch.exciseno,
        faxnumber: branch.faxnumber,
        gstno:  branch.gstno,
        importexportno: branch.importexportno,
        isactive:  branch.isactive,
        mobilenumber:  branch.mobilenumber,
        panno:  branch.panno,
        phonenumber:  branch.phonenumber,
        remarks: branch.remarks,
        tanno: branch.tanno,
        tinno: branch.tinno,
        tollfreenumber:  branch.tollfreenumber,
        taxexemptionno: branch.taxexemptionno,
        x_id:0
      };

     // branch.foid=branch.user.id;
      console.log("finalbranch :",params)
  //console.log('ytdgsyt :',branch);
 
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
