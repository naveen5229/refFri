import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PendingDocumentComponent } from '../../documents/documentation-modals/pending-document/pending-document.component';

@Component({
  selector: 'documents-summary',
  templateUrl: './documents-summary.component.html',
  styleUrls: ['./documents-summary.component.scss', '../../pages/pages.component.css']
})
export class DocumentsSummaryComponent implements OnInit {
  data = { result: [], summary: [] };
  docdata = [];
  columns = [];
  vehicle_info = [];
  total_norecord = 0;
  total_normal = 0;
  total_expired = 0;
  total_unverified = 0;
  total_noimage = 0;
  total_recs = 0;

  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService) {

    this.common.refresh = this.refresh.bind(this);
    this.getDocumentMatrixData();

  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getDocumentMatrixData();
  }

  getDocumentMatrixData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentMatrixDataWeb', {})
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        for(var i=0; i<this.data.summary.length; i++) {
          console.log("status:" + this.data.summary[i].status + "=" + this.data.summary[i].total);
          switch(this.data.summary[i].status) {
            case 0: this.total_norecord = this.data.summary[i].total; break;
            case 1: this.total_noimage = this.data.summary[i].total; break;
            case 2: this.total_expired = this.data.summary[i].total; break;
            case 3: this.total_unverified = this.data.summary[i].total; break;
            case 4: this.total_normal = this.data.summary[i].total; break;
          }
        }
        this.total_recs = this.data.result.length;
        if(this.data.result.length) {
          for(var key in this.data.result[0]) {
            this.columns.push(key);
          }
          console.log("columns");
          console.log(this.columns);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  
  getDocumentType(strval) {
    if(strval) {
      if(strval.indexOf('1_')> -1) {
        return 1;
      } else if(strval.indexOf('2_')> -1) {
        return 2;
      } else if(strval.indexOf('3_')> -1) {
        return 3;
      } else if(strval.indexOf('4_')> -1) {
        return 4;
      }
    } else {
      return 0;
    }
  }

  fetchDocumentData(row, col, colval) {
    console.log("colval:");
    console.log(colval);
    if(colval) {
      let arrval = colval.split('_');
      let docid = arrval[1];
      let regno = row['vehicle'];
      console.log("docid:" + docid);
      this.common.loading++;
      this.api.post('Vehicles/getPendingDocDetailsById', { x_document_id: docid })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.docdata = res['data'];

        let newdate = "";
        if (this.docdata[0].expiry_date != 'undefined' && this.docdata[0].expiry_date != null)
          newdate = this.common.changeDateformat1(this.docdata[0].expiry_date).split(' ')[0];

        let rowData = {
          id: this.docdata[0].id,
          vehicle_id: this.docdata[0].vehicle_id,
          regno: this.docdata[0].regno,
          document_type: this.docdata[0].type,
          document_type_id: this.docdata[0].type_id,
          agent: this.docdata[0].agent,
          agent_id: this.docdata[0].document_agent_id,
          wef_date: this.docdata[0].wef_date,
          expiry_date: newdate,
          issue_date: this.docdata[0].issue_date,
          remarks: this.docdata[0].remarks,
          img_url: this.docdata[0].img_url,
          img_url2: this.docdata[0].img_url2,
          img_url3: this.docdata[0].img_url3,
          doc_no: this.docdata[0].document_number,
          rto: this.docdata[0].rto,
          amount: this.docdata[0].amount
        };

        console.log("rowdata:");
        console.log(rowData);
        this.common.params = { rowData, title: 'Document Details', canUpdate: 0 };
        this.common.handleModalSize('class', 'modal-lg', '1200');
        const activeModal = this.modalService.open(PendingDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        activeModal.result.then(mdldata => {
          console.log("response:", mdldata);
          // this.getDocumentMatrixData();
        });
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    }    
  }
}
