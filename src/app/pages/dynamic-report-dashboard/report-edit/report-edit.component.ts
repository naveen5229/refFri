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
  predefined = [];
  backtabname = false;
  challanReports = [];

  constructor(private api: ApiService, private common: CommonService, private activeModal: NgbActiveModal) {
    this.getSavedReports();
    this.getpredefinedReports();
    if(this.common.params && this.common.params.caltabname){
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
        this.challanReports = res['data'].filter(report => report.dashboard_name === "Challan DashBoard");

        
        let data = JSON.parse(localStorage.getItem('dynamic-report')) || [];

        this.challanReports.map((rptdata,index)=>{
                      data.map((stordata)=>{
                        if(stordata.type != 'dynamic' && rptdata.rpt_name == stordata.rpt_name){
                          this.challanReports[index].isUsed=true;
                          let info = stordata;
                        //let ele = document.getElementById('challan-report-' + this.draggingReport.id);

                        // ele.style.transform = `translate(${event.layerX}px, ${event.layerY}px)`;
                        // ele.setAttribute('data-x', event.layerX);
                        // ele.setAttribute('data-y', event.layerY);


                        let target = document.getElementById('report-' + rptdata.id);
                        let x = info.x_pos;
                        let y = info.y_pos;
                        target.style.width = info.rpt_width + 'px';
                        target.style.height = info.rpt_height + 'px';
                        target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                        }
                      });
                    });

        



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
          let info = data.find(d => d.rpt_name == report.name);
          report.isUsed = false;
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
    console.log('draggingReport:', this.draggingReport);
    this.draggingReport.isUsed = true;
    let ele = null;
    if (this.draggingReportType === 'challan') {
      ele = document.getElementById('challan-report-' + this.draggingReport.id);
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
      rpttype: 'DB'
    };
    this.api.post('Tmgreport/deletereport', params)
      .subscribe(res => {
        console.log('res:', res);
      }, err => {
        console.log('err:', err);
      })
  }

}
