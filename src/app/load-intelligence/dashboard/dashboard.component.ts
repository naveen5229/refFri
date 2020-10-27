import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { CsvErrorReportComponent } from '../../modals/csv-error-report/csv-error-report.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {



  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService) {
  }
  ngOnInit() {
  }

  

}
