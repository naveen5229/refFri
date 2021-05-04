import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import interact from 'interactjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportEditComponent } from './report-edit/report-edit.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'dynamic-report-dashboard',
  templateUrl: './dynamic-report-dashboard.component.html',
  styleUrls: ['./dynamic-report-dashboard.component.scss']
})
export class DynamicReportDashboardComponent implements OnInit {
  reports = [];
  startDate = this.common.getDate(-15);
  endDate = new Date();
  assign = {
    startDate: this.startDate,
    endDate: this.endDate,
  };
  dynamicReports = [];

  constructor(private api: ApiService, private modalService: NgbModal, private common: CommonService) {
    this.getDynamicReports();

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }



  getSavedReports() {
    this.api.get(`GraphicalReport/getGraphicalReportList`)
      .subscribe((res: any) => {
        console.log('Res11111:', res,this.dynamicReports);
        this.reports = res.data.map(report => {
          report.isUsed = false;
          let info = this.dynamicReports.find(d => d.rpt_name == report.name);
          if (info) {
            let style = {
              width: info.rpt_width + "px",
              height: info.rpt_height + "px",
              x: info.x_pos + 'px',
              y: info.y_pos + 'px',
            }
            report.style = style;
          }
          return report;
        }).filter(report => report.style)
      })
  }
  callreport(calldata){
    console.log('callreport',calldata);
  }

  getDynamicReports() {
    const params = {
      'rpttype': 'DB',
      'rptname': ''
    };
    this.common.loading++;
    this.api.post('tmgreport/GetDynamicReportMaster', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('GetDynamicReportMaster:', res);
        this.dynamicReports = res['data'];
        localStorage.setItem('dynamic-report', JSON.stringify(this.dynamicReports));
        this.getSavedReports();

      }, err => {
        console.log(err);
        this.common.loading--;
      })
  }

  editReport() {
    let modal = this.modalService.open(ReportEditComponent, { size: 'lg', container: 'nb-layout' });
    modal.result.then(data => {
      this.getDynamicReports();
    })
  }

  getReport() {
    this.assign = {
      startDate: this.startDate,
      endDate: this.endDate,
    }
  }

}
