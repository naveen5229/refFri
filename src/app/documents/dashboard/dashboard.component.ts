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
        // total: { title: 'Total', placeholder: 'Total' },
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

  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getDocumentData();
  }

  getDocumentData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics', {})
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
        docType: { value: doc.name },
        normal: { value: doc.normal, class: doc.normal > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'normal') },
        noEntry: { value: doc.noentrytilldate, class: doc.noentrytilldate > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'noentrytilldate') },
        imageMissing: { value: doc.imagemissing, class: doc.imagemissing > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'imagemissing') },
        Expiry: { value: doc.expiringin30days, class: doc.expiringin30days > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'expiringin30days') },
        alreadyExpiry: { value: doc.alreadyexpired, class: doc.alreadyexpired > 0 ? 'blue' : 'black', action: this.openData.bind(this, doc, 'alreadyexpired') },
        // total: { value: doc.total }
      });
    });

    columns.push({
      docType: { value: 'Total' },
      normal: { value: this.getSum('normal'), action: this.totalData.bind(this, 'normal') },
      noEntry: { value: this.getSum('noentrytilldate') },
      imageMissing: { value: this.getSum('imagemissing') },
      Expiry: { value: this.getSum('expiringin30days') },
      alreadyExpiry: { value: this.getSum('alreadyexpired') },
      total: { value: '' }
    });

    return columns;

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

  getSum(key) {
    let total = 0;
    this.documentData.map(data => {
      total += data[key];
    });
    return total;
  }


  totalData(status) {
    this.common.params = { status, title: 'Document Report' };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentData();
      }
    });
  }

}
