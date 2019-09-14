import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'error-report',
  templateUrl: './error-report.component.html',
  styleUrls: ['./error-report.component.scss', '../../../pages/pages.component.css']
})
export class ErrorReportComponent implements OnInit {
  title = '';
  btn = '';
  errors = [];
  columns = [];
  reason = null;
  bgColor(bgColor) {

    return bgColor ? bgColor : 'white';
  }
  textColor(textColor) {
    return textColor ? textColor : 'black';
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {

    this.common.handleModalSize('class', 'modal-lg', '1024');
    this.title = this.common.params.title || 'Error Report';
    this.btn = this.common.params.btn || 'Close';
    this.errors = this.common.params.errorData;
    this.reason = this.common.params.Reason;
    this.columnSperate();

  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  columnSperate() {
    if (this.errors.length) {
      for (var key in this.errors[0]) {
        if (key.charAt(0) != "_")
          this.columns.push(key);
      }
    }
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
}
