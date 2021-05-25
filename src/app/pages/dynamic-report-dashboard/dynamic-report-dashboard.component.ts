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
    "Challan Trends (Last 6 Months) ": "challan-trend",
    "State Wise Challans in Last 30 Days": "state-wise",
    "Worst 3 Drivers(Count Wise) Last 15 Days": "worst-drivers",
    "Most Aged Challans (Pending)": "most-aged",
    "Latest Challans": "latest",
    "Worst 3 Drivers(Amount Wise) Last 1 Year": "worst-drivers-years",
    "Onward KMPD Graph": "trip-onward-kmpd",
    "Avg. Loading Time Graph": "avg-loading",
    "Avg. Unloading Time Graph": "avg-unloading",
    "Worst 3 Vehicles in Last Week(Breakdown + Maintenance)": "worst-vehicles",
    "Longest Loading Sites in Last 7 Days": "longest-loading",
    "Longest Unloading Drivers in Last 30 Days": "longest-unloading",
    "Slowest 3 Onward Drivers in Last 7 Days": "slowest-onward",
    "Longest Unloading Sites in Last 7 Days": "longest-unloading-sites",
    "GPS Performance": "gps-performance",
    "Live Traffic Status": "live-traffic-status",
    "Longest Driver Unavailable": "longest-driver-unavailable",
    "Longest GPS Offline": "longest-gps-offline",
    "Top Vehicles with RTO + Maintenance + Breakdown Issues": "top-vehicle-rto",
    "Longest Loading Sites": "longest-loading-sites",
    "Longest Unloading Vehicles": "longest-unloading-offline",
    "Slowest Onward Vehicles": "slowest-onward-veicles",
    "Longest Empty Vehicles": "longest-empty-vehicle",
    "Driver Contacted %": "drivercontacted",
    "Supervisor Wise Unresponded Driver Calls %": "supervisor-wise-unrespond",
    "Unresponded Driver Calls %": "unrespond-driver-calls",
    "Worst 3 Drivers (Unresponded Supervisor Calls %)": "worst-driver",
    "Average Loading TAT": "avg-loading-tat",
    "Onward KMPD": "calls-onward-kmpd",
    "Average Unloading TAT": "avg-unloading-tat",
    "Alert Ack TAT in Last 7 Days": "alert-ack-tat",
    "Alert Call TAT in Last 7 Days": "alert-call-tat",
    "VSC TAT in Last 7 Days": "vsc-tat",
    "Longest Alert Not Ack": "longest-alert-not-ack",
    "Longest Alert Not Called": "longest-alert-not-called",
    "Longest Pending VSC TAT": "longest-pending-vsc-tat",
    "Longest Open Alert": "longest-open-alert",
    "Worst Call TAT in Last 7 Days": "worst-call-tat",
    "Worst VSC TAT in Last 7 Days": "worst-vsc-tat",
    "Live Traffic Status ": "live-traffic-status-analysys",
    "Longest Onward Halt": "longest-onward-halt",
    "Longest GPS Offline ": "longest-gps-offline-analysys",
    "Longest Loading Site": "longest-loading-site",
    "Longest Unloading Vehicles ": "longest-unloading-vehicle",
    "Slowest Onward Vehicles ": "slowest-onward-vehicle",
    "Longest Parking Vehicles": "longest-parking-vehicle",
    "Avg. Loading Time Graph ": "avg-loading-time-graph",
    "Worst 3 Loading Sites (30 days) ": "worst-loading-sites",
    "Worst 3 Loading Sites (7 days) ": "worst-loading-sites-days",
    "Loading Trends (Top 3 sites)": "loading-trends",
    "Worst 3 Parking Sites (30 days)": "worst-parking-sites",
    "Worst 3 Parking Sites (7 days)": "worst-parking-sites-days",





  };
  containerHeight = 0;
  containerWidth = 0;
  challanReports = [];
  usedChallanWidgtets = [];
  constructor(private api: ApiService, private modalService: NgbModal, private common: CommonService) {
    this.getDynamicReports();
    //this.getpredefinedReports();
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
    this.usedChallanWidgtets = calldata.filter(report => (report.type.includes('challan-')||report.type.includes('state-')||report.type.includes('worst-drivers')||report.type.includes('most-aged')||report.type.includes('latest')||report.type.includes('worst-drivers-years')||report.type.includes('trip-onward-kmpd')||report.type.includes('avg-loading')||report.type.includes('avg-unloading')||report.type.includes('worst-vehicles')||report.type.includes('longest-loading')||report.type.includes('longest-unloading')||report.type.includes('slowest-onward')||report.type.includes('longest-unloading-sites')||report.type.includes('gps-performance')||report.type.includes('live-traffic-status')||report.type.includes('longest-driver-unavailable')||report.type.includes('longest-gps-offline')||report.type.includes('top-vehicle-rto')||report.type.includes('longest-loading-sites')||report.type.includes('longest-unloading-offline')||report.type.includes('slowest-onward-veicles')||report.type.includes('longest-empty-vehicle')||report.type.includes('drivercontacted')||report.type.includes('supervisor-wise-unrespond')||report.type.includes('unrespond-driver-calls')||report.type.includes('worst-driver')||report.type.includes('avg-loading-tat')||report.type.includes('calls-onward-kmpd')||report.type.includes('avg-unloading-tat')||report.type.includes('alert-ack-tat')||report.type.includes('alert-call-tat')||report.type.includes('vsc-tat')||report.type.includes('longest-alert-not-ack')||report.type.includes('longest-pending-vsc-tat')||report.type.includes('longest-open-alert')||report.type.includes('worst-call-tat')||report.type.includes('worst-vsc-tat')||report.type.includes('live-traffic-status-analysys')||report.type.includes('longest-onward-halt')||report.type.includes('longest-gps-offline-analysys')||report.type.includes('longest-unloading-vehicle')||report.type.includes('slowest-onward-vehicle')||report.type.includes('longest-parking-vehicle')||report.type.includes('avg-loading-time-graph')||report.type.includes('worst-loading-sites')||report.type.includes('worst-loading-sites-days')||report.type.includes('loading-trends')||report.type.includes('worst-parking-sites-days')))

    console.log('usedChallanWidgtets:', this.usedChallanWidgtets,this.reports);
    this.caltabname = (this.usedChallanWidgtets.length)?this.usedChallanWidgtets[0].rpt_tabname : calldata[0].rpt_tabname;

    this.reports.map((data) => {
      calldata.map((cdata) => {
        console.log('callreport1', data.name, cdata.rpt_name, cdata.type);
        if (data.name == cdata.rpt_name && cdata.type == "dynamic") {
          data.isUsed = true;
          this.dynamicreportcall.push(data);
          
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
    console.log('common.params',this.common.params );
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
