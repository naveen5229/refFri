import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoWebViewSummaryComponent } from '../../modals/fo-web-view-summary/fo-web-view-summary.component';
@Component({
  selector: 'web-activity-summary',
  templateUrl: './web-activity-summary.component.html',
  styleUrls: ['./web-activity-summary.component.scss']
})
export class WebActivitySummaryComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  data = [];
  table = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    console.log('refresh');
  }
  getFoWebView() {
    let params = "startDate=" + this.common.dateFormatter(this.startDate) + "&endDate=" + this.common.dateFormatter(this.endDate);
    this.common.loading++;
    this.api.get('FoAdmin/getFoAdminWebActivity?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;
        }
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  setTable() {
    let headings = {
      Name: { title: 'Name', placeholder: 'Name' },
      Channel: { title: 'Channel', placeholder: 'Channel' },
      ['Login Count']: { title: 'Login Count', placeholder: 'Login Count' },
      ['Total Dur(Min)']: { title: 'Total Dur(Min)', placeholder: 'Total Dur(Min)' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        Name: { value: req.Name, action: this.activitySummary.bind(this, req) },
        Channel: { value: req.Channel },
        ['Login Count']: { value: req['Login Count'] == null ? "-" : req['Login Count'] },
        ['Total Dur(Min)']: { value: req['Total Dur(Min)'] == null ? "-" : req['Total Dur(Min)'] },
        // amount: { value: req.amount == null ? "-" : req.amount },


      };
      columns.push(column);
    });
    return columns;
  }
  activitySummary(summary) {
    this.common.params = { summary, sd: this.startDate, ed: this.endDate };
    const activeModal = this.modalService.open(FoWebViewSummaryComponent, { size: 'lg', container: 'nb-layout' });
  }
}
