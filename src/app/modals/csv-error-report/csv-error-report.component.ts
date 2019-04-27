import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'csv-error-report',
  templateUrl: './csv-error-report.component.html',
  styleUrls: ['./csv-error-report.component.scss']
})
export class CsvErrorReportComponent implements OnInit {
  title = '';
  btn = '';
  errors = [];
  columns = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1024');
    this.title = this.common.params.title || 'Error Report';
    this.btn = this.common.params.btn || 'Close';
    this.errors = this.common.params.errorData;
    console.log("error data", this.errors);
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
      console.log("columns");
      console.log(this.columns);
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
