import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import interact from 'interactjs';
import { CommonService } from '../../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'report-edit',
  templateUrl: './report-edit.component.html',
  styleUrls: ['./report-edit.component.scss']
})
export class ReportEditComponent implements OnInit {

  reports = [];
  draggingReport = null;
  draggingReportType = '';
  dynamicReports = [];
  tabname = '';
  callToShow = 1;
  // collOne = false;
  // collTwo = false;
  // collThree = false;
  predefined = [];
  backtabname = false;
  challanReports = [];
  tripReports = [];
  trafficReports = [];
  CallsReports = [];
  AlertReports = [];
  AnalysisReports = [];
  LoadingAnalysisReports = [];
  DocumentReports = [];
  constructor(private api: ApiService, private common: CommonService, private activeModal: NgbActiveModal) {
    this.getSavedReports();
    this.getpredefinedReports();
    console.log('common.params',this.common.params);
    if (this.common.params && this.common.params.caltabname) {
      this.tabname = this.common.params.caltabname;
      this.backtabname = true;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.common.handleModalSize('class', 'modal-lg', '1400');
  }

  getDynamicReports() {
    const params = {
      'rpttype': 'DB',
      'rptname': ''
    }
    this.api.post('tmgreport/GetDynamicReportMaster', params)
      .subscribe(res => {
        console.log('res:', res);
      }, err => {
        console.log('err:', err);
      })
  }
  getpredefinedReports() {
    this.api.get('tmgreport/getdynamicreport')
      .subscribe(res => {
        let dao = _.groupBy(res['data'], 'dashboard_name');
        this.predefined = [];
        Object.keys(dao)
          .map(key => {
            this.predefined.push(dao[key]);
          })
        console.log('predefined', this.predefined);
        this.challanReports = res['data'].filter(report => report.dashboard_name === ("Challan DashBoard"));
        this.tripReports = res['data'].filter(report => report.dashboard_name === ("Trip DashBoard"));
        this.trafficReports = res['data'].filter(report => report.dashboard_name === ("Traffic DashBoard"));
        this.CallsReports = res['data'].filter(report => report.dashboard_name === ("Calls DashBoard"));
        this.AlertReports = res['data'].filter(report => report.dashboard_name === ("Alerts DashBoard"));
        this.AnalysisReports = res['data'].filter(report => report.dashboard_name === ("Live Analysis"));
        this.LoadingAnalysisReports = res['data'].filter(report => report.dashboard_name === ("Loading Analysis"));
        this.DocumentReports = res['data'].filter(report => report.dashboard_name === ("Document DashBoard"));

        console.log('DocumentReports',this.DocumentReports);

        let data = JSON.parse(localStorage.getItem('dynamic-report')) || [];

        this.challanReports.map((rptdata, index) => {
          
          data.map((stordata) => {
          //console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                if(this.tabname == stordata.rpt_tabname){
               // console.log('selected stored', stordata, rptdata);

                this.challanReports[index].isUsed = true;
                }
               // console.log('stored', stordata, rptdata);
                let info = stordata;
                let target = document.getElementById('challan-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });

        this.tripReports.map((rptdata, index) => {
          
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('selected stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.tripReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('trip-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        this.trafficReports.map((rptdata, index) => {
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('selected stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.trafficReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('traffic-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        this.CallsReports.map((rptdata, index) => {
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('selected stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.CallsReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('calls-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        this.AlertReports.map((rptdata, index) => {
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('selected stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.AlertReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('calls-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        this.AnalysisReports.map((rptdata, index) => {
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('selected stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.AnalysisReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('analysis-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        this.LoadingAnalysisReports.map((rptdata, index) => {
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('selected stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.LoadingAnalysisReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('loading-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        this.DocumentReports.map((rptdata, index) => {
          data.map((stordata) => {
          console.log('stro',stordata,rptdata);
            if (stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name) {
              setTimeout(() => {
                console.log('DocumentReports stored', stordata, this.tabname);

                if(this.tabname == stordata.rpt_tabname){

                this.DocumentReports[index].isUsed = true;
                }
                let info = stordata;
                let target = document.getElementById('document-report-' + rptdata.id);
                let x = info.x_pos;
                let y = info.y_pos;
                target.style.width = info.rpt_width + 'px';
                target.style.height = info.rpt_height + 'px';
                target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              }, 3000)

            }
          });
        });
        console.log('tripReports',this.LoadingAnalysisReports);



      }, err => {
        console.log('err:', err);
      })
  }

  getSavedReports() {
    this.api.get(`GraphicalReport/getGraphicalReportList`)
      .subscribe((res: any) => {
        console.log('Res:', res);
        let data = JSON.parse(localStorage.getItem('dynamic-report')) || [];




        this.reports = res.data.map(report => {
          //tabname
          let info = data.find(d => d.rpt_name == report.name);
          report.isUsed = false;
          console.log('final issue',report,this.tabname,info);
          // if (info && this.tabname == info.rpt_tabname) {
          //   report.isUsed = true;
          // }
          if (info) {
            report.isUsed = true;
          }

          let style = {
            width: "300px",
            height: "300px",
            x: 0,
            y: 0,
          }
          report.style = style;
          return report;

        });
        console.log('reports 123',this.reports);
        setTimeout(() => {
          this.setHeightAndWidth();
          this.jrxDragAndResize()
        }, 1000);
      })
  }

  setHeightAndWidth() {
    let data = JSON.parse(localStorage.getItem('dynamic-report')) || [];
    this.reports.map(report => {
      let info = data.find(d => d.rpt_name == report.name);
      if (info) {
        let target = document.getElementById('report-' + report._id);
        let x = info.x_pos;
        let y = info.y_pos;

        target.style.width = info.rpt_width + 'px';
        target.style.height = info.rpt_height + 'px';

        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    })

  }

  jrxDragAndResize() {
    interact('.draggable')
      .draggable({ onmove: this.jrxDragger.bind(this) })
      .resizable({
        preserveAspectRatio: true,
        edges: { left: true, right: true, bottom: true, top: true }
      })
      .on('resizemove', this.jrxResizer.bind(this));
  }

  jrxDragger(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  jrxResizer(event) {
    const target = event.target;
    let x = (parseFloat(target.getAttribute('data-x')) || 0);
    let y = (parseFloat(target.getAttribute('data-y')) || 0);

    target.style.width = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  handleDragEnd(event, report) {
    console.log('Event', event);
    console.log('report:', report);
  }

  selectDraggable(report, type?) {
    this.draggingReportType = type || '';
    this.draggingReport = report;
  }

  handleDropped(event) {
    console.log('handleDropped::', event);
    event.preventDefault();
    console.log('draggingReport:', this.draggingReport,this.draggingReportType);
    this.draggingReport.isUsed = true;
    let ele = null;
    if (this.draggingReportType === 'challan') {
      ele = document.getElementById('challan-report-' + this.draggingReport.id);
    } else if (this.draggingReportType === 'trip') {
      ele = document.getElementById('trip-report-' + this.draggingReport.id);
    } else if (this.draggingReportType === 'traffic') {
      ele = document.getElementById('traffic-report-' + this.draggingReport.id);
    } else {
      ele = document.getElementById('report-' + this.draggingReport._id);
    }
    ele.style.transform = `translate(${event.layerX}px, ${event.layerY}px)`;
    ele.setAttribute('data-x', event.layerX);
    ele.setAttribute('data-y', event.layerY);
    this.draggingReport = null;
  }

  handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  saveReport() {
    if (this.tabname) {
      const data = this.reports
        .filter(report => report.isUsed)
        .map(report => {
          let ele = document.getElementById('report-' + report._id);
          let width = ele.offsetWidth;
          let height = ele.offsetHeight;
          console.log('JRX:', ele);
          let x = parseFloat(ele.getAttribute('data-x'));
          let y = parseFloat(ele.getAttribute('data-y'));
          if (x < 0) {
            x = 0;
          }
          if (y < 0) {
            y = 0;
          }
          return {
            'rpttype': "DB",
            'rptwidth': width,
            'rptheight': height,
            'rptname': report.name,
            'tabname': this.tabname,
            'tabtitle': report.name,
            'ypos': parseInt(y.toString()) || 1,
            'xpos': parseInt(x.toString()) || 1
          }
        });

      data.push(...this.challanReports
        .filter(report => report.isUsed)
        .map(report => {
          let ele = document.getElementById('challan-report-' + report.id);
          let width = ele.offsetWidth;
          let height = ele.offsetHeight;
          let x = parseFloat(ele.getAttribute('data-x'));
          let y = parseFloat(ele.getAttribute('data-y'));
          if (x < 0) {
            x = 0;
          }
          if (y < 0) {
            y = 0;
          }
          return {
            'rpttype': "DB",
            'rptwidth': width,
            'rptheight': height,
            'rptname': report.rpt_name,
            'tabname': this.tabname,
            'tabtitle': report.rpt_title,
            'ypos': parseInt(y.toString()) || 1,
            'xpos': parseInt(x.toString()) || 1
          }
        }));
        data.push(...this.tripReports
          .filter(report => report.isUsed)
          .map(report => {
            let ele = document.getElementById('trip-report-' + report.id);
            let width = ele.offsetWidth;
            let height = ele.offsetHeight;
            let x = parseFloat(ele.getAttribute('data-x'));
            let y = parseFloat(ele.getAttribute('data-y'));
            if (x < 0) {
              x = 0;
            }
            if (y < 0) {
              y = 0;
            }
            return {
              'rpttype': "DB",
              'rptwidth': width,
              'rptheight': height,
              'rptname': report.rpt_name,
              'tabname': this.tabname,
              'tabtitle': report.rpt_title,
              'ypos': parseInt(y.toString()) || 1,
              'xpos': parseInt(x.toString()) || 1
            }
          }));
          data.push(...this.trafficReports
            .filter(report => report.isUsed)
            .map(report => {
              let ele = document.getElementById('traffic-report-' + report.id);
              let width = ele.offsetWidth;
              let height = ele.offsetHeight;
              let x = parseFloat(ele.getAttribute('data-x'));
              let y = parseFloat(ele.getAttribute('data-y'));
              if (x < 0) {
                x = 0;
              }
              if (y < 0) {
                y = 0;
              }
              return {
                'rpttype': "DB",
                'rptwidth': width,
                'rptheight': height,
                'rptname': report.rpt_name,
                'tabname': this.tabname,
                'tabtitle': report.rpt_title,
                'ypos': parseInt(y.toString()) || 1,
                'xpos': parseInt(x.toString()) || 1
              }
            }));
            data.push(...this.CallsReports
              .filter(report => report.isUsed)
              .map(report => {
                let ele = document.getElementById('calls-report-' + report.id);
                let width = ele.offsetWidth;
                let height = ele.offsetHeight;
                let x = parseFloat(ele.getAttribute('data-x'));
                let y = parseFloat(ele.getAttribute('data-y'));
                if (x < 0) {
                  x = 0;
                }
                if (y < 0) {
                  y = 0;
                }
                return {
                  'rpttype': "DB",
                  'rptwidth': width,
                  'rptheight': height,
                  'rptname': report.rpt_name,
                  'tabname': this.tabname,
                  'tabtitle': report.rpt_title,
                  'ypos': parseInt(y.toString()) || 1,
                  'xpos': parseInt(x.toString()) || 1
                }
              }));
              data.push(...this.AlertReports
                .filter(report => report.isUsed)
                .map(report => {
                  let ele = document.getElementById('alert-report-' + report.id);
                  let width = ele.offsetWidth;
                  let height = ele.offsetHeight;
                  let x = parseFloat(ele.getAttribute('data-x'));
                  let y = parseFloat(ele.getAttribute('data-y'));
                  if (x < 0) {
                    x = 0;
                  }
                  if (y < 0) {
                    y = 0;
                  }
                  return {
                    'rpttype': "DB",
                    'rptwidth': width,
                    'rptheight': height,
                    'rptname': report.rpt_name,
                    'tabname': this.tabname,
                    'tabtitle': report.rpt_title,
                    'ypos': parseInt(y.toString()) || 1,
                    'xpos': parseInt(x.toString()) || 1
                  }
                }));
                data.push(...this.AnalysisReports
                  .filter(report => report.isUsed)
                  .map(report => {
                    let ele = document.getElementById('alert-report-' + report.id);
                    let width = ele.offsetWidth;
                    let height = ele.offsetHeight;
                    let x = parseFloat(ele.getAttribute('data-x'));
                    let y = parseFloat(ele.getAttribute('data-y'));
                    if (x < 0) {
                      x = 0;
                    }
                    if (y < 0) {
                      y = 0;
                    }
                    return {
                      'rpttype': "DB",
                      'rptwidth': width,
                      'rptheight': height,
                      'rptname': report.rpt_name,
                      'tabname': this.tabname,
                      'tabtitle': report.rpt_title,
                      'ypos': parseInt(y.toString()) || 1,
                      'xpos': parseInt(x.toString()) || 1
                    }
                  }));
                  data.push(...this.LoadingAnalysisReports
                    .filter(report => report.isUsed)
                    .map(report => {
                      let ele = document.getElementById('loading-report-' + report.id);
                      let width = ele.offsetWidth;
                      let height = ele.offsetHeight;
                      let x = parseFloat(ele.getAttribute('data-x'));
                      let y = parseFloat(ele.getAttribute('data-y'));
                      if (x < 0) {
                        x = 0;
                      }
                      if (y < 0) {
                        y = 0;
                      }
                      return {
                        'rpttype': "DB",
                        'rptwidth': width,
                        'rptheight': height,
                        'rptname': report.rpt_name,
                        'tabname': this.tabname,
                        'tabtitle': report.rpt_title,
                        'ypos': parseInt(y.toString()) || 1,
                        'xpos': parseInt(x.toString()) || 1
                      }
                    }));
                    data.push(...this.DocumentReports
                      .filter(report => report.isUsed)
                      .map(report => {
                        let ele = document.getElementById('document-report-' + report.id);
                        let width = ele.offsetWidth;
                        let height = ele.offsetHeight;
                        let x = parseFloat(ele.getAttribute('data-x'));
                        let y = parseFloat(ele.getAttribute('data-y'));
                        if (x < 0) {
                          x = 0;
                        }
                        if (y < 0) {
                          y = 0;
                        }
                        return {
                          'rpttype': "DB",
                          'rptwidth': width,
                          'rptheight': height,
                          'rptname': report.rpt_name,
                          'tabname': this.tabname,
                          'tabtitle': report.rpt_title,
                          'ypos': parseInt(y.toString()) || 1,
                          'xpos': parseInt(x.toString()) || 1
                        }
                      }));
      data.forEach((info, index) => {
        this.api
          .post('tmgreport/SaveDynamicReportMaster', info)
          .subscribe(res => {
            console.log('res:', res);
          }, err => {
            console.log('err:', err);
          });
      });
      this.common.loading++;
      setTimeout(() => {
        this.common.loading--;
        this.activeModal.close();
      }, 1000);
    } else {
      this.common.showError('Tab Name Mandatory');
    }
  }

  deleteReport(report) {
    report.isUsed = false;
    const params = {
      rptname: report.name,
      rpttype: 'DB',
      tabname: this.tabname
    };
    this.api.post('Tmgreport/deletereport', params)
      .subscribe(res => {
        console.log('res:', res);
      }, err => {
        console.log('err:', err);
      })
  }

  deleteChallanReport(challanReport) {
    challanReport.isUsed = false;
    const params = {
      rptname: challanReport.rpt_name,
      rpttype: 'DB',
      tabname: this.tabname
    };
    this.api.post('Tmgreport/deletereport', params)
      .subscribe(res => {
        console.log('res:', res);
      }, err => {
        console.log('err:', err);
      })
  }
  deleteTripReport(challanReport) {
    challanReport.isUsed = false;
    const params = {
      rptname: challanReport.rpt_name,
      rpttype: 'DB',
      tabname: this.tabname
    };
    this.api.post('Tmgreport/deletereport', params)
      .subscribe(res => {
        console.log('res:', res);
      }, err => {
        console.log('err:', err);
      })
  }
  deleteTrafficReport(challanReport) {
    challanReport.isUsed = false;
    const params = {
      rptname: challanReport.rpt_name,
      rpttype: 'DB',
      tabname: this.tabname
    };
    this.api.post('Tmgreport/deletereport', params)
      .subscribe(res => {
        console.log('res:', res);
      }, err => {
        console.log('err:', err);
      })
    }
    deleteCallReport(challanReport) {
      challanReport.isUsed = false;
      const params = {
        rptname: challanReport.rpt_name,
        rpttype: 'DB',
        tabname: this.tabname
      };
      this.api.post('Tmgreport/deletereport', params)
        .subscribe(res => {
          console.log('res:', res);
        }, err => {
          console.log('err:', err);
        })
      }
      deleteAlertReport(challanReport) {
        challanReport.isUsed = false;
        const params = {
          rptname: challanReport.rpt_name,
          rpttype: 'DB',
          tabname: this.tabname
        };
        this.api.post('Tmgreport/deletereport', params)
          .subscribe(res => {
            console.log('res:', res);
          }, err => {
            console.log('err:', err);
          })
        }
        deleteAnalysisReport(challanReport) {
          challanReport.isUsed = false;
          const params = {
            rptname: challanReport.rpt_name,
            rpttype: 'DB',
            tabname: this.tabname
          };
          this.api.post('Tmgreport/deletereport', params)
            .subscribe(res => {
              console.log('res:', res);
            }, err => {
              console.log('err:', err);
            })
          }
}
