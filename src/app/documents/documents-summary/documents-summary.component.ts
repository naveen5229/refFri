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
  data = { columns: [], vehicle_info: [] };
  docdata = [];
  columns = [];
  vehicle_info = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService) {

    this.common.refresh = this.refresh.bind(this);
    this.getDocumentMatrixData();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getDocumentMatrixData();
  }

  getDocumentMatrixData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentMatrixData', {})
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  fetchDocumentData(datarow, doc_type) {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentDetailsByRegno', { x_regno: datarow['Vehicle No.'], x_doc_type: doc_type })
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
          doc_no: this.docdata[0].document_number,
          rto: this.docdata[0].rto,
          amount: this.docdata[0].amount
        };

        this.common.params = { rowData, title: 'Document Details', canUpdate: 0 };
        this.common.handleModalSize('class', 'modal-lg', '1200');
        const activeModal = this.modalService.open(PendingDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        activeModal.result.then(mdldata => {
          console.log("response:");
          console.log(mdldata);
        });
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }
}
