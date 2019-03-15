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
    window.location.reload();
  }

  getDocumentMatrixData() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentMatrixDataWeb', {})
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.total_recs = this.data.result.length;
        if(this.data.result.length) {
          for(var key in this.data.result[0]) {
            if(key.charAt(0) != "_")
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
      } else if(strval.indexOf('5_')> -1) {
        return 5;
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
    var rows=tblelt.querySelectorAll('tr');
    console.log("rows=" + rows.length);
    if(rows.length > 1) {
      for(var i=1; i<rows.length; i++) {
        rows[i].classList.remove('cls-hide');
      }
    }
  }
  
  filterRows(status) {
    console.log("checking for status:" + status);
    this.resetRowsVisibility();
    let tblelt = document.getElementById('tbldocs');
    var rows=tblelt.querySelectorAll('tr');
    console.log("rows=" + rows.length);
    if(rows.length > 1) {
      //console.log("rowscoll::");
      //console.log(rows);
      for(var i=1; i<rows.length; i++) {
        let classlst = rows[i].classList;
        if(classlst.length) {
          let flag = 0;
          if(classlst.length == 1 && classlst[0] != ("" + status)) {
            rows[i].classList.add('cls-hide');
          } else {
            for(var j=0; j< classlst.length; j++) {
              if(classlst[j].indexOf('--') > -1) {
                let arrclass = classlst[j].split('--');
                console.log(arrclass);
                console.log("indexval=" + arrclass.indexOf(status));
                if(arrclass.indexOf("" + status) == -1) {
                  console.log("row hidden:");
                  console.log(rows[i]);
                  rows[i].classList.add('cls-hide');
                  flag = 1;
                  continue;
                }
              } else if(classlst[j].length == 1 && classlst[j] != ("" + status)) {
                rows[i].classList.add('cls-hide');
                flag = 1;
                continue;
              } 
            }
          }
        }
      }
    }
  }

  getDocClasses(row) {
    let docclass = [];
    let strclass = "";
    
      for(var i=0; i< this.columns.length; i++){
        let colval = row[this.columns[i]];
        if(colval) {
          if(colval.indexOf('_') > -1) {
            let status = colval.split('_')[0];
            docclass.push(status);
          }
        }
      }
      if(docclass.length == 0) {
        docclass.push(0);
      }
      strclass = docclass.join('--');
        
    return strclass;
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
