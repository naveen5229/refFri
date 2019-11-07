import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'document-issues',
  templateUrl: './document-issues.component.html',
  styleUrls: ['./document-issues.component.scss']
})
export class DocumentIssuesComponent implements OnInit {
  table = null;
  data = [];
  fodata = [];
  title = '';

  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.title = this.common.params.title;
    this.displayIssueReport();
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  displayIssueReport() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentIssuesByFoid', {})
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setTable() {
    let headings = {
      regno: { title: 'Vehicle Number ', placeholder: 'Vehicle Number' },
      issue: { title: 'Issue', placeholder: 'Issue' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(issue => {
      let column = {
        regno: { value: issue.y_regno },
        issue: { value: issue.y_issue },
        rowActions: {}
      };
      columns.push(column);
    });
    return columns;
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
        let left_heading = 'Document Issues';
        let center_heading = "";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
