import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { DocumentReportComponent } from '../../documents/documentation-modals/document-report/document-report.component';

@AutoUnsubscribe()
@Component({
  selector: 'tmg-documents',
  templateUrl: './tmg-documents.component.html',
  styleUrls: ['./tmg-documents.component.scss']
})
export class TmgDocumentsComponent implements OnInit {
  currentStatus = [];
  documentData = [];
  headings = [];
  table = {
    data: {
      headings: {
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    setTimeout(() => this.getCurrentStatus());
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  refresh() {
    this.getCurrentStatus();
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getCurrentStatus() {
    this.currentStatus = [];
    //this.common.loading++;
    let params = { totalrecord: 3 };
    this.api.post('Tmgreport/GetDocsDetails', params)
      .subscribe(res => {
     //   --this.common.loading;
        console.log('currentStatus:', res);
       // this.currentStatus = res['data'];
       this.documentData = res['data'];
       let first_rec = this.documentData[0];
       this.table.data.headings = {};
       for (var key in first_rec) {
         if (key.charAt(0) != "_") {
           this.headings.push(key);
           let hdgobj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
           this.table.data.headings[key] = hdgobj;
         }
       }
       this.table.data.columns = this.getTableColumns();
      }, err => {
      //  --this.common.loading;
        console.log('Err:', err);
      });
  }
  // getDetials(url, params, value = 0, type = 'days') {
  //   let dataparams = {
  //     view: {
  //       api: url,
  //       param: params,
  //       type: 'post'
  //     },

  //     title: 'Details'
  //   }
  //   if (value) {
  //     let startDate = type == 'months' ? new Date(new Date().setMonth(new Date().getMonth() - value)) : new Date(new Date().setDate(new Date().getDate() - value));
  //     let endDate = new Date();
  //     dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
  //     dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
  //   }
  //   console.log("dataparams=", dataparams);
  //   this.common.handleModalSize('class', 'modal-lg', '1100');
  //   this.common.params = { data: dataparams };
  //   const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  // }

  
  getTableColumns() {
    let columns = [];
    this.documentData.map(doc => {
      let valobj = {};
      let total = {};
      let docobj = { document_type_id: 0 };
      for (var i = 0; i < this.headings.length; i++) {
        let strval = doc[this.headings[i]];
        let status = '';
        let val = 0;
        if (strval.indexOf('_') > 0) {
          let arrval = strval.split('_');
          status = arrval[0];
          val = arrval[1];
        } else {
          val = strval;
        }
        docobj.document_type_id = doc['_doctypeid'];
        valobj[this.headings[i]] = { value: val, class: (val > 0) ? 'blue' : 'black', action: val > 0 ? this.getDetials.bind(this, 'Tmgreport/GetDocsSumaryDetails',{doctypeid: docobj,status: status}) : '' };

      }

      columns.push(valobj);
    });
    return columns;
  }
 
  openData(docReoprt, status) {
    this.common.params = { docReoprt, status, title: 'Document Report' };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getCurrentStatus();
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

  getDetials(url, params, value = 0,type='days') {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },
  
      title: 'Details'
    }
    if (value) {
      let startDate = type == 'months'? new Date(new Date().setMonth(new Date().getMonth() - value)): new Date(new Date().setDate(new Date().getDate() - value));
      let endDate = new Date();
      dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
      dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
    }
    console.log("dataparams=", dataparams);
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}
