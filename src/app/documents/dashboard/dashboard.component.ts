import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentReportComponent } from '../documentation-modals/document-report/document-report.component';
import { Body } from '@angular/http/src/body';
import { from } from 'rxjs';
import { NgIf } from '@angular/common';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../pages/pages.component.css']
})
export class DashboardComponent implements OnInit {

  documentData = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getDocumentData();
  }

  ngOnInit() {
  }

  getDocumentData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics', {})
      .subscribe(res => {
        this.common.loading--;
        this.documentData = res['data'];
        console.info("dashbord Data", this.documentData);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  openData(docReoprt, status) {
    this.common.params = { docReoprt, status, title: 'Document Report' };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentData();
      }
    });
  }
  
  // totalData(status){
  //   this.common.params = {status, title: 'Document Report' };
  //   const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       this.getDocumentData();
  //     }
  //   });
  // }

  getSum(key) {
    let total = 0;
    this.documentData.map(data => {
      total += data[key];
    });
    return total;
  }
}
