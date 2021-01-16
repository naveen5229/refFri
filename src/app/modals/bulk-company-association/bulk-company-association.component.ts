import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { CsvErrorReportComponent } from '../csv-error-report/csv-error-report.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'bulk-company-association',
  templateUrl: './bulk-company-association.component.html',
  styleUrls: ['./bulk-company-association.component.scss']
})
export class BulkCompanyAssociationComponent implements OnInit {

  companyAssociationType=[];
  companyBranches=[];
  branchId=null;
  assType=null;
  csv=null;

  constructor(public activeModel:NgbActiveModal,
    public api:ApiService,
    public common:CommonService,
    private modalService: NgbModal) {
      this.getCompanyAssociation();
      this.getCompanyBranches();

     }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModel.close();
  }

  getCompanyAssociation() {
    this.common.loading++;
    this.api.get('Suggestion/getAssocTypeWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.companyAssociationType = res['data'];
      }, err => {
        this.common.loading--;
        console.log('APi Error:',err);
        this.common.showError();
      });
  }

  getCompanyBranches() {
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', {})
      .subscribe(res => {
        this.common.loading--;
        this.companyBranches = res['data'];
      },
        err => {
          this.common.loading--;
          console.log('APi Error:',err);
          this.common.showError();
        });
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type,event.target);
        // if (file.type != "application/vnd.ms-excel" && file.type != "application/vnd.openxml") {
        //   alert("Select valid Format Are : CSV,xlsx");
        //   return false;
        // }
        res = res.toString().replace('vnd.ms-excel', 'csv');
        console.log('Base 64: ', res);
        this.csv = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
        this.common.showError();
      })
  }

  sampleCsv() {
    window.open("http://13.126.215.102/sample/csv/sample_company_assoc.csv");
  }

  saveBulkCompany(){

    const params = {
      branch: this.branchId,
      userGrpid: this.assType,
      importCsv: this.csv,
    };
    this.common.loading++;
    this.api.post('ManageParty/addCompWithAssocCsv', params)
      .subscribe(res => {
        this.common.loading--;
        let successData = res['data']['success'];
        let errorData = res['data']['fail'];
        console.log("error: ", errorData);
        alert(res["msg"]);
        this.common.params = { apiData: params, successData, errorData, title: 'Fuel csv Verification',isUpdate:false };
        const activeModal = this.modalService.open(CsvErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }



}
