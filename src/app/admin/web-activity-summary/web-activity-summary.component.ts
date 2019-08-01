import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'web-activity-summary',
  templateUrl: './web-activity-summary.component.html',
  styleUrls: ['./web-activity-summary.component.scss']
})
export class WebActivitySummaryComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  data = [];
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService) { }

  ngOnInit() {
  }
  getFoWebView() {
    let params = "startDate=" + this.common.dateFormatter1(this.startDate) + "&endDate=" + this.common.dateFormatter1(this.endDate);
    this.common.loading++;
    this.api.get('FoAdmin/getFoAdminWebActivity?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];


      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
}
