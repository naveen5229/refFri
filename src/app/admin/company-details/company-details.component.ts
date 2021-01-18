import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { UpdateCompanyComponent } from '../../modals/update-company/update-company.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss', '../../pages/pages.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  companies = null;

  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getCompanies();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  
  refresh() {
    console.log('Refresh');
    this.getCompanies(); 
   }

  getCompanies() {
    ++this.common.loading;
    //Suggestion/GetCompanies2
    this.api.get('company/getCompanies')
      .subscribe(res => {
        --this.common.loading;
        console.log("response", res);
        this.companies = res['data'];
        console.log('this.companies:', this.companies);
        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }
  updateCompanyDetails(company) {
    console.log("company", company);
    this.common.params = { company: company }
    const activeModal = this.modalService.open(UpdateCompanyComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {

      this.getCompanies();


    });
  }

}
