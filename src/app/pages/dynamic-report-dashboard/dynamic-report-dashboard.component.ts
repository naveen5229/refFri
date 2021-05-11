import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import interact from 'interactjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportEditComponent } from './report-edit/report-edit.component';
import { CommonService } from '../../services/common.service';
import * as _ from 'lodash';

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
  tabsdata: any;
  dynamicReports = [];
  dynamicreportcall = [];
  caltabname = '';
  widgetsList = {
    "Challan Trends (Last 6 Months) ": "challan-trend"
  };
  containerHeight = 0;
  containerWidth = 0;
  challanReports = [];
  usedChallanWidgtets = [];
  constructor(private api: ApiService, private modalService: NgbModal, private common: CommonService) {
    this.getDynamicReports();
    this.getpredefinedReports();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  getpredefinedReports() {
    this.api.get('tmgreport/getdynamicreport')
      .subscribe(res => {
        this.challanReports = res['data'].filter(report => report.dashboard_name === "Challan DashBoard");
      }, err => {
        console.log('err:', err);
      })
  }



  getSavedReports() {
    this.api.get(`GraphicalReport/getGraphicalReportList`)
      .subscribe((res: any) => {
        console.log('Res11111:', res, this.dynamicReports);
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
        this.callreport(this.tabsdata[0]);

      })
  }
  callreport(calldata) {
    console.log('callreport', calldata);
    this.dynamicreportcall = [];
    this.usedChallanWidgtets = calldata.filter(report => report.type.includes('challan-'))


    console.log('usedChallanWidgtets:', this.usedChallanWidgtets);
    this.reports.map((data) => {
      calldata.map((cdata) => {
        console.log('callreport1', data.name, cdata.rpt_name, cdata.type);

        if (data.name == cdata.rpt_name && cdata.type == "dynamic") {
          this.dynamicreportcall.push(data);
          this.caltabname = cdata.rpt_tabname;
        }
      })
    });
    console.log('dynamicreportcall', this.dynamicreportcall);
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
        this.dynamicReports = res['data'].map(report => {
          report.type = this.widgetsList[report.rpt_name] || 'dynamic';
          if (report.rpt_height + report.y_pos > this.containerHeight) {
            this.containerHeight = report.rpt_height + report.y_pos;
          }

          if (report.rpt_width + report.x_pos > this.containerWidth) {
            this.containerWidth = report.rpt_width + report.x_pos;
          }
          return report;
        });
        //let tabs =this.dynamicReports[]
        let tabs = _.groupBy(res['data'], 'rpt_tabname');
        this.tabsdata = [];
        Object.keys(tabs)
          .map(key => {
            this.tabsdata.push(tabs[key]);
          })
        console.log('predefined', this.tabsdata);

        this.getSavedReports();

      }, err => {
        console.log(err);
        this.common.loading--;
      })
  }

  editReport(flag?) {
    if (flag) {
      localStorage.setItem('dynamic-report', JSON.stringify(this.dynamicReports));
      this.common.params = {
        caltabname: this.caltabname
      };
    } else {
      localStorage.removeItem("dynamic-report");
      this.common.params = '';
    }
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
