import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentReportComponent } from '../documentation-modals/document-report/document-report.component';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../pages/pages.component.css']
})
export class DashboardComponent implements OnInit {

  documentData = [];
  table = {
    data: {
      headings: {
        docType: { title: 'Document Type', placeholder: 'Document Type' },
        normal: { title: 'Normal', placeholder: 'Normal' },
        noEntry: { title: 'No Entry Till Date', placeholder: 'No Entry Till Date' },
        imageMissing: { title: 'Image Missing', placeholder: 'Image Missing' },
        Expiry: { title: 'Expiry In 30 days', placeholder: 'Expiry In 30 days' },
        alreadyExpiry: { title: 'Already Expired', placeholder: 'Already Expired' },
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };



  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getDocumentData();

    this.common.refresh = this.refresh.bind(this);
    console.log("foid:", this.user._customer.id);
  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getDocumentData();
  }

  getDocumentData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics',{})
      .subscribe(res => {
        this.common.loading--;
        this.documentData = res['data'];
        console.info("dashbord Data", this.documentData);
        this.table.data.columns = this.getTableColumns();
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    
    let columns = [];
    this.documentData.map(doc => {
      columns.push({
        docType: { value: doc.docname },
        normal: { value: doc.verified, class: doc.verified > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'verified') },
        noEntry: { value: doc.unverified, class: doc.unverified > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'unverified') },
        imageMissing: { value: doc.pendingimage, class: doc.pendingimage > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'pendingimage') },
        Expiry: { value: doc.expiring30days, class: doc.expiring30days > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'expiring30days') },
        alreadyExpiry: { value: doc.expired, class: doc.expired > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'expired') },
      });
    });

    // columns.push({
    //   serial:{value: 'sum ' },
    //   docType: { value: 'Total' },
    //   normal: { value: this.getSum('verified'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'verified') },
    //   noEntry: { value: this.getSum('unverified'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'unverified') },
    //   imageMissing: { value: this.getSum('pendingimage'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'pendingimage') },
    //   Expiry: { value: this.getSum('expiring30days'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'expiring30days') },
    //   alreadyExpiry: { value: this.getSum('expired'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'expired') },
    // });

    return columns;

  }



  openData(docReoprt, status) {
    this.common.params = { docReoprt, status, title: 'Document Report' };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentData();
        window.location.reload();
      }
    });
  }

  getSum(key) {
    let total = 0;
    this.documentData.map(data => {
      total += data[key];
    });
    return total;
  }


  totalData(status) {
    // this.common.handleModalSize('class', 'modal-lg', '1200');
    this.common.params = { status, title: 'Document Report' };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentData(); 
        window.location.reload();
      }
    });
  }

}
