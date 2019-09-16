import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditDocumentComponent } from '../../documents/documentation-modals/edit-document/edit-document.component';
import { DocumentIssuesComponent } from '../../documents/documentation-modals/document-issues/document-issues.component';
import { AddDocumentComponent } from '../documentation-modals/add-document/add-document.component';
import { DocumentRef } from '@agm/core/utils/browser-globals';
import { DocumentReportComponent } from '../documentation-modals/document-report/document-report.component';
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
  total_recs = 0;
  fodata = [];

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
    this.columns = [];
    this.common.loading++;
    let user_id = this.user._details.id;
    if (this.user._loggedInBy == 'admin')
      user_id = this.user._customer.id;
    this.api.post('Vehicles/getDocumentMatrixDataWeb', { x_user_id: user_id })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.total_recs = this.data.result.length;
        if (this.data.result.length) {
          for (var key in this.data.result[0]) {
            if (key.charAt(0) != "_")
              this.columns.push(key);
          }

        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  getDocumentType(strval) {
    if (strval) {
      if (strval.indexOf('_') > -1) {
        return strval.split('_')[0];
      } else {
        return 99;
      }
    } else {
      return 0;
    }
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  resetRowsVisibility() {
    let tblelt = document.getElementById('tbldocs');
    var rows = tblelt.querySelectorAll('tr');
    if (rows.length > 1) {
      for (var i = 1; i < rows.length; i++) {
        rows[i].classList.remove('cls-hide');
      }
    }
  }

  showAllRecords() {
    this.resetRowsVisibility();
    this.resetSerialNo();
  }

  resetSerialNo() {
    let tblelt = document.getElementById('tbldocs');
    var rows = tblelt.querySelectorAll('tr');
    if (rows.length > 1) {
      let ctr = 1;
      for (var i = 1; i < rows.length; i++) {
        if (!rows[i].classList.contains('cls-hide')) {
          rows[i].cells[0].innerHTML = "" + ctr;
          ctr++;
        }
      }
    }
  }

  filterRows(status) {
    this.resetRowsVisibility();
    let tblelt = document.getElementById('tbldocs');
    var rows = tblelt.querySelectorAll('tr');
    if (rows.length > 1) {

      for (var i = 1; i < rows.length; i++) {
        let classlst = rows[i].classList;
        if (classlst.length) {
          let flag = 0;
          if (classlst.length == 1 && classlst[0] != ("" + status)) {
            rows[i].classList.add('cls-hide');
          } else {
            for (var j = 0; j < classlst.length; j++) {
              if (classlst[j].indexOf('--') > -1) {
                let arrclass = classlst[j].split('--');

                if (arrclass.indexOf("" + status) == -1) {

                  rows[i].classList.add('cls-hide');
                  flag = 1;
                  continue;
                }
              } else if (classlst[j].length == 1 && classlst[j] != ("" + status)) {
                rows[i].classList.add('cls-hide');
                flag = 1;
                continue;
              }
            }
          }
        }
      }
    }
    this.resetSerialNo();
  }

  getDocClasses(row) {
    let docclass = [];
    let strclass = "";

    for (var i = 0; i < this.columns.length; i++) {
      let colval = row[this.columns[i]];
      if (colval) {
        if (colval.indexOf('_') > -1) {
          let status = colval.split('_')[0];
          docclass.push(status);
        }
      } else if (colval == null) {
        docclass.push(0);
      }
    }
    if (docclass.length == 0) {
      docclass.push(0);
    }
    strclass = docclass.join('--');

    return strclass;
  }

  fetchDocumentData(row, col, colval) {

    if (colval) {
      let arrval = colval.split('_');
      let docid = arrval[1];
      let regno = row['vehicle'];
      this.common.loading++;
      this.api.post('Vehicles/getPendingDocDetailsById', { x_document_id: docid })
        .subscribe(res => {
          this.common.loading--;
          this.docdata = res['data'];

          let documentData = [{
            regNumber: this.docdata[0].regno,
            id: this.docdata[0].id,
            vehicleId: this.docdata[0].vehicle_id,
            documentType: this.docdata[0].type,
            documentId: this.docdata[0].type_id,
            issueDate: this.docdata[0].issue_date,
            wefDate: this.docdata[0].wef_date,
            expiryDate: this.docdata[0].expiry_date,
            agentId: this.docdata[0].document_agent_id,
            agentName: this.docdata[0].agent,
            documentNumber: this.docdata[0].document_number,
            docUpload: this.docdata[0].img_url,
            docUpload2: this.docdata[0].img_url2,
            docUpload3: this.docdata[0].img_url3,
            remark: this.docdata[0].remarks,
            rto: this.docdata[0].rto,
            amount: this.docdata[0].amount,
          }];
          this.common.params = { documentData, title: 'Document Details', canUpdate: 0, vehicleId: this.docdata[0].vehicle_id };
          this.common.handleModalSize('class', 'modal-lg', '1200');
          const activeModal = this.modalService.open(EditDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          activeModal.result.then(mdldata => {
          });
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        this.fodata = res['data'];
        let left_heading = this.fodata['name'];
        let center_heading = "Document Status";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  showIssues() {
    this.common.params = { title: 'Documents Issues', status: 'pendingAll', docReoprt: { document_type_id: 0 } };
    const activeModal = this.modalService.open(DocumentReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  noRecordDocumentData(norecordData, col, colval) {
    colval = colval.split("_")[2];
    this.common.params = { norecordData, col, colval };
    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentMatrixData();
      }
    });
  }
}
