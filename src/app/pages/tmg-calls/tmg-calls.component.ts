import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ChartComponent } from 'angular2-chartjs';

@AutoUnsubscribe()
@Component({
  selector: 'tmg-calls',
  templateUrl: './tmg-calls.component.html',
  styleUrls: ['./tmg-calls.component.scss']
})
export class TmgCallsComponent implements OnInit {
  callsDrivar = [];
  callsSupervisorWiseNotRespod = [];
  callsNotRespod = [];
  callsSupervisorWiseTopWorstDriverCalls = [];
  callsSupervisorLoadingTat = [];
  callOnwardKmd = []
  callsSupervisorUnLoadingTat = [];
  xAxisData = [];
  driverIdArr;

  chart1 = {
    type: '',
    data: {},
    options: {},
  };

  chart2 = {
    type: '',
    data: {},
    options: {},
  };
  chart3 = {
    type: '',
    data: {},
    options: {},
  };
  chart4 = {
    type: '',
    data: {},
    options: {},
  };
  chart5 = {
    type: '',
    data: {},
    options: {},
  };

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.xAxisData = [];
    this.getCallsDrivar(0);
    this.getCallsSupervisorWiseNotRespod(1);
    this.getCallsNotRespod(2);
    this.getCallsSupervisorWiseTopWorstDriverCalls(3);
    this.getCallsSupervisorLoadingTat(4);
    this.getCallOnwardKmd(5);
    this.getCallsSupervisorUnLoadingTat(6);
  }

  // getCallsDrivar(index) {
  //   this.callsDrivar = [];
  //   this.showLoader(index);
  //   let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  //   let endDate = new Date();
  //   let params = {
  //     fromdate: this.common.dateFormatter(startDate),
  //     todate: this.common.dateFormatter(endDate),
  //     groupdays: 7,
  //     isfo: false,
  //     isadmin: true
  //   };
  //   this.api.post('Tmgreport/GetCallsDrivar', params)
  //     .subscribe(res => {
  //       console.log('callsDrivar:', res);
  //       this.callsDrivar = res['data'] || [];
  //       // this.driverIdArr = res['data'].map(element => {
  //       //     element = element._id;
  //       //   return element
  //       // });
  //       console.log('driver array :', this.driverIdArr);

  //       if (this.callsDrivar.length > 0) this.handleChart1();
  //       this.hideLoader(index);;
  //     }, err => {
  //       this.hideLoader(index);
  //       console.log('Err:', err);
  //     });
  // }

  getCallsDrivar(index) {
    this.callsDrivar = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isfo: false,
      isadmin: true
    };
    this.api.post('Tmgreport/GetCallsDriverDaywise', params)
      .subscribe(res => {
        console.log('callsDrivar:', res);
        this.callsDrivar = res['data'] || [];
        // this.driverIdArr = res['data'].map(element => {
        //     element = element._id;
        //   return element
        // });
        console.log('driver array :', this.driverIdArr);

        if (this.callsDrivar.length > 0) this.handleChart1();
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getCallsSupervisorWiseNotRespod(index) {
    this.callsSupervisorWiseNotRespod = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      totalrecord: 7,
      isfo: false,
      isadmin: true,
      fromdate: startDate,
      todate: endDate,
    };
    this.showLoader(index);
    this.api.post('Tmgreport/GetCallsSupervisorWiseNotRespod', params)
      .subscribe(res => {
        console.log('callsSupervisorWiseNotRespod:', res);
        this.callsSupervisorWiseNotRespod = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getCallsNotRespod(index) {
    this.callsNotRespod = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isfo: false,
      isadmin: true
    };
    this.api.post('Tmgreport/GetCallsNotRespod', params)
      .subscribe(res => {
        console.log('tripUnLoadindTime:', res);
        this.callsNotRespod = res['data'] || [];
        if (this.callsNotRespod.length > 0) this.handleChart2();
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getCallsSupervisorWiseTopWorstDriverCalls(index) {
    this.callsSupervisorWiseTopWorstDriverCalls = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      totalrecord: 3,
      fromdate: startDate,
      todate: endDate,
      isfo: false,
      isadmin: true
    };
    this.showLoader(index);
    this.api.post('Tmgreport/GetCallsSupervisorWiseTopWorstDriverCalls', params)
      .subscribe(res => {
        console.log('callsSupervisorWiseTopWorstDriverCalls:', res);
        this.callsSupervisorWiseTopWorstDriverCalls = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getCallsSupervisorLoadingTat(index) {
    this.callsSupervisorLoadingTat = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isfo: false,
      isadmin: true
    };
    this.api.post('Tmgreport/GetCallsSupervisorLoadingTat', params)
      .subscribe(res => {
        console.log('callsSupervisorLoadingTat:', res);
        this.callsSupervisorLoadingTat = res['data'] || [];
        if (this.callsSupervisorLoadingTat.length > 0) this.handleChart3();
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getCallsSupervisorUnLoadingTat(index) {
    this.callsSupervisorUnLoadingTat = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));;
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 15,
      isfo: false,
      isadmin: true
    };
    this.showLoader(index);
    this.api.post('Tmgreport/GetCallsSupervisorUnLoadingTat', params)
      .subscribe(res => {
        console.log('callsSupervisorUnLoadingTat:', res);
        this.callsSupervisorUnLoadingTat = res['data'] || [];
        if (this.callsSupervisorUnLoadingTat.length > 0) this.handleChart5();
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }
  getCallOnwardKmd(index) {
    this.callOnwardKmd = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isfo: false,
      isadmin: true
    };
    this.showLoader(index);
    this.api.post('Tmgreport/GetCallOnwardKmd', params)
      .subscribe(res => {
        console.log('callsSupervisorUnLoadingTat:', res);
        this.callOnwardKmd = res['data'] || [];
        if (this.callOnwardKmd.length > 0) this.handleChart4();
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }
  getAlertWorstCallTat(index) {
    this.callsSupervisorUnLoadingTat = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isfo: true,
      isadmin: true
    };
    this.api.post('Tmgreport/GetAlertWorstCallTat', params)
      .subscribe(res => {
        console.log('tripUnLoadindTime:', res);
        this.callsSupervisorUnLoadingTat = res['data'] || [];
        if (this.callsSupervisorUnLoadingTat.length > 0) this.handleChart5();
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  handleChart1() {
    let yaxis = [];
    let xaxis = [];
    this.callsDrivar.map(tlt => {
      xaxis.push(this.common.changeDateformat(tlt['Date'], 'dd'));
      yaxis.push(tlt['Calls Percent']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart1", xaxis, yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Call %',
          data: yaxisObj.scaleData,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
      this.chart1.options = {
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },

        maintainAspectRatio: false,
        title: {
          display: true,
        },
        display: true,
        elements: {
          line: {
            tension: 0
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Call %' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize },
            suggestedMin: yaxisObj.minValue,
          }]
        }
      };
  }


  // chartClicked(event) {
  //   console.log('event:', event[0]._index);
  //   let id = event[0]._index;
  //   this.api.post('Tmgreport/GetCallsDrivar:', id).subscribe(res=> {
  //     console.log(JSON.stringify(res));

  //   })
  // }


  chart1Clicked(event) {

    let Date = this.callsDrivar[event[0]._index].Date;
    console.log('event[0]._index', event[0]._index, event[0], Date);
    this.passingIdChart1Data(Date);
  }

  passingIdChart1Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: true,
      isfo: false,
      date: parseDate,
     // ref: 'tmg-calls'
    };
    // this.api.post('Tmgreport/GetCallsDrivar', params)
    //   .subscribe(res => {
    //     console.log('callsDrivar 111 :', res);

    //     this.hideLoader(id);;
    //   }, err => {
    //     this.hideLoader(id);;
    //     console.log('Err:', err);
    //   });
    this.getDetials('Tmgreport/GetCallsDriverDaywise', params)
  }

  chart2Clicked(event) {
    let driverId = this.callsDrivar[event[0]._index]._id;
    this.passingIdChart2Data(driverId);
  }

  passingIdChart2Data(id) {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: true,
      isfo: false,
      id: id,
      ref: 'Not-Responded-Calls'
    };
    console.log('params :', params);
    this.getDetials('Tmgreport/GetCallsNotRespod', params)
  }


  handleChart2() {
    let yaxis = [];
    let xaxis = [];
    this.callsNotRespod.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['percent']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart2", xaxis, yaxis);
    this.chart2.type = 'line'
    this.chart2.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Call %',
          data: yaxisObj.scaleData,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
      this.chart2.options = {
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },

        maintainAspectRatio: false,
        title: {
          display: true,
        },
        display: true,
        elements: {
          line: {
            tension: 0
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Call %' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize },
            suggestedMin: yaxisObj.minValue,
          }]
        }
      };
  }

  handleChart3() {
    let yaxis = [];
    let xaxis = [];
    let executives = _.groupBy(this.callsSupervisorLoadingTat, 'Executive');
    let periods = _.groupBy(this.callsSupervisorLoadingTat, 'Period');
    let datasets = Object.keys(periods)
      .map(period => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        yaxis.push(...periods[period].map(item => item['TAT(Hrs)']))
        return {
          label: period,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          data: periods[period].map(item => item['TAT(Hrs)'])
        }
      });
    console.log('DataSets:', datasets);
    console.log("handleChart3", xaxis, yaxis);
    this.chart3.type = 'bar'
    this.chart3.data = {
      labels: Object.keys(executives),
      datasets
    };
    let chartobj = this.common.chartScaleLabelAndGrid(yaxis);
    this.chart3.options = {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true
      },

      maintainAspectRatio: false,
      title: {
        display: true,
      },
      display: true,
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'TAT (in Hrs.)' + chartobj.yaxisLabel
          },
          ticks: { stepSize: chartobj.gridSize },
          suggestedMin: chartobj.minValue
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function (tooltipItems, data) {
            console.log("tooltipItems", tooltipItems, "data", data);
            let tti = ('' + tooltipItems.yLabel).split(".");
            let min = tti[1] ? String(parseInt(tti[1]) * 6).substring(0,2) : '00';
            return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
          }
        }
      },

    };
  }

  chart3Clicked(event) {
    console.log('chart 3 event is: ', event, event[0]._datasetIndex);
    let xid = event[0]._datasetIndex + 1;
    let isFoId = this.callsSupervisorLoadingTat[event[0]._index]._adminusers_id;
    console.log('diff para', this.callsSupervisorLoadingTat[event[0]._index]);
    this.passingDataInsideChart3Modal(xid, isFoId);
  }

  passingDataInsideChart3Modal(id, isFoId) {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: true,
      isfo: isFoId,
      xid: id,
    };
    console.log('params :', params);
    this.getDetials('Tmgreport/GetCallsSupervisorLoadingTat', params)
  }



  handleChart4() {
    let xaxis = [];
    let executives = _.groupBy(this.callOnwardKmd, 'Executive');
    let periods = _.groupBy(this.callOnwardKmd, 'Period');
    let yaxis = [];
    let datasets = Object.keys(periods)
      .map(period => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        yaxis.push(...periods[period].map(item => item['Onward KMs']))
        return {
          label: period,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          data: this.common.chartScaleLabelAndGrid(periods[period].map(item => item['Onward KMs'])).scaleData
        }
      });

    this.chart4.type = 'bar'
    this.chart4.data = {
      labels: Object.keys(executives),
      datasets
    };
    console.log('yaxis:', yaxis);
    let chartobj = this.common.chartScaleLabelAndGrid(yaxis);

    this.chart4.options = {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true
      },

      maintainAspectRatio: false,
      title: {
        display: true,
      },
      display: true,
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'KM' + chartobj.yaxisLabel
          },
          ticks: { stepSize: chartobj.gridSize },
          suggestedMin: chartobj.minValue
        }]
      },
    };
    console.log(' this.chart4:', this.chart4);
  }

  chart4Clicked(event) {
    console.log('chart 3 event is: ', event);
    let xid = event[0]._datasetIndex + 1;
    let isFoId = this.callOnwardKmd[event[0]._index]._adminusers_id;
    this.passingDataInsideChart4Modal(xid, isFoId);
  }

  passingDataInsideChart4Modal(id, isFoId) {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: true,
      isfo: isFoId,
      xid: id,
    };
    console.log('params :', params);
    this.getDetials('Tmgreport/GetCallOnwardKmd', params)
  }

  handleChart5() {
    let yaxis = [];
    let xaxis = [];
    let executives = _.groupBy(this.callsSupervisorUnLoadingTat, 'Executive');
    let periods = _.groupBy(this.callsSupervisorUnLoadingTat, 'Period');
    let datasets = Object.keys(periods)
      .map(period => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        yaxis.push(...periods[period].map(item => item['TAT(Hrs)']))
        return {
          label: period,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          data: periods[period].map(item => item['TAT(Hrs)'])
        }
      });
    console.log('DataSets:', datasets);
    console.log("handleChart5", xaxis, yaxis);
    this.chart5.type = 'bar'
    this.chart5.data = {
      labels: Object.keys(executives),
      datasets
    };

    let chartobj = this.common.chartScaleLabelAndGrid(yaxis);
    this.chart5.options = {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true
      },

      maintainAspectRatio: false,
      title: {
        display: true,
      },
      display: true,
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'TAT (in Hrs.)' + chartobj.yaxisLabel
          },
          ticks: { stepSize: chartobj.gridSize },
          suggestedMin: chartobj.minValue
        }]
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function (tooltipItems, data) {
            console.log("tooltipItems", tooltipItems, "data", data);
            let tti = ('' + tooltipItems.yLabel).split(".");
            let min = tti[1] ? String(parseInt(tti[1]) * 6).substring(0,2) : '00';
            return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
          }
        }
      },
    };
  }

  chart5Clicked(event) {
    console.log('chart 5 event is: ', event);
    console.log('passingDataInsideChart5Modal :', this.callsSupervisorUnLoadingTat[event[0]._index]._adminusers_id);
    let xid = event[0]._datasetIndex + 1;
    //let xid = this.callsSupervisorUnLoadingTat[event[0]._index]._id;
    let isFoId = this.callsSupervisorUnLoadingTat[event[0]._index]._adminusers_id;
    this.passingDataInsideChart5Modal(xid, isFoId);
  }

  passingDataInsideChart5Modal(id, isFoId) {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 15,
      isadmin: true,
      isfo: isFoId,
      xid: id,
    };
    console.log('params :', params);
    this.getDetials('Tmgreport/GetCallsSupervisorUnLoadingTat', params)
  }

  getDetials(url, params, value = 0, type = 'days', isDateFilter = false) {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },

      title: 'Details',
      isDateFilter: isDateFilter
    }
    if (params.ref) {
      dataparams['ref'] = params.ref;
      delete params.ref;
    }

    if (value) {
      let startDate = type == 'months' ? new Date(new Date().setMonth(new Date().getMonth() - value)) : new Date(new Date().setDate(new Date().getDate() - value));
      let endDate = new Date();
      dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
      dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
    }
    console.log("dataparams=", dataparams);
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  showLoader(index) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("outer");
      let loader = document.createElement('div');
      loader.className = 'loader';
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index) {
    try {
      let outers = document.getElementsByClassName("outer");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }

}
