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
  headings = [];
  table = {
    data: {
      headings: {
        /*
        docType: { title: 'Document Type', placeholder: 'Document Type' },
        verified: { title: 'verified', placeholder: 'Verified' },
        unverified: { title: 'unverified', placeholder: 'Unverified' },
        pendingimage: { title: 'pendingimage', placeholder: 'Image Missing' },
        expiring30days: { title: 'Expiry In 30 days', placeholder: 'Expiry In 30 days' },
        expired: { title: 'Expired', placeholder: 'Expired' },
        */
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

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  refresh() {
    console.log('Refresh');
    //this.getDocumentData();
    window.location.reload();
  }

  getDocumentData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatisticsnew', {})
      .subscribe(res => {
        this.common.loading--;
        this.documentData = res['data'];
        console.info("dashbord Data", this.documentData);
        let first_rec = this.documentData[0];
        this.table.data.headings = {};
        for(var key in first_rec) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = {title: this.formatTitle(key), placeholder: this.formatTitle(key)};
            this.table.data.headings[key] = hdgobj;
          }
        }
        console.log("hdgs:");
        console.log(this.headings);
        console.log(this.table.data.headings);

        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    /*
    this.documentData.map(doc => {
      columns.push({
        docType: { value: doc.docname },
        verified: { value: doc.verified, class: doc.verified > 0 ? 'blue' : 'black', action:doc.verified >0 ? this.openData.bind(this, doc, 'verified') : '' },
        unverified: { value: doc.unverified, class: doc.unverified > 0 ? 'blue' : 'black', action: doc.unverified >0 ? this.openData.bind(this, doc, 'unverified'): '' },
        pendingimage: { value: doc.pendingimage, class: doc.pendingimage > 0 ? 'blue' : 'black', action: doc.pendingimage >0 ? this.openData.bind(this, doc, 'pendingimage') : '' },
        expiring30days: { value: doc.expiring30days, class: doc.expiring30days > 0 ? 'blue' : 'black', action: doc.expiring30days >0 ? this.openData.bind(this, doc, 'expiring30days') : '' },
        expired: { value: doc.expired, class: doc.expired > 0 ? 'blue' : 'black', action: doc.expired >0 ? this.openData.bind(this, doc, 'expired') : '', },
      });
    });
    */
   this.documentData.map(doc => {
      let valobj = {};
      let total = {};
      let docobj = { document_type_id : 0};
      for(var i = 0; i < this.headings.length; i++) {
        let strval = doc[this.headings[i]];
        let status = '';
        let val = 0;
        if(strval.indexOf('_') > 0) {
            let arrval = strval.split('_');
            status = arrval[0];
            val = arrval[1];
        } else {
          val = strval;
        }
        docobj.document_type_id = doc['_doctypeid'];
        valobj[this.headings[i]] = { value: val, class: (val > 0 )? 'blue': 'black', action: val >0 ? this.openData.bind(this, docobj, status) : '' };
        

      }
     
      columns.push(valobj); 
      // columns.push(total);     
    });
    

    // columns.push({
    //   serial:{value: 'sum ' },
    //   docType: { value: 'Total' },
    //   verified: { value: this.getSum('verified'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'verified') },
    //   unverified: { value: this.getSum('unverified'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'unverified') },
    //   pendingimage: { value: this.getSum('pendingimage'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'pendingimage') },
    //   expiring30days: { value: this.getSum('expiring30days'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'expiring30days') },
    //   expired: { value: this.getSum('expired'), class: 1 > 0 ? 'blue' : 'black', action: this.totalData.bind(this, 'expired') },
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

  // totalData(status) {
  //   // this.common.handleModalSize('class', 'modal-lg', '1200');
  //   this.common.params = { status, title: 'Document Report' };
  //   const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       this.getDocumentData();
  //       window.location.reload();
  //     }
  //   });
  // }
}
