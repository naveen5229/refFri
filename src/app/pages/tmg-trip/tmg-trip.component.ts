import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { DomSanitizer } from '@angular/platform-browser';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tmg-trip',
  templateUrl: './tmg-trip.component.html',
  styleUrls: ['./tmg-trip.component.scss']
})
export class TmgTripComponent implements OnInit {
  tripOnwardKmd = [];
  tripUnLoadindTime = [];
  tripLoadindTime = [];
  tripLongHalt = [];
  longestLoadindSites = [];
  longestUnLoadindDriver = [];
  tripSlowestOnward = [];
  longestUnLoadindSites = [];
  tripGpsPerformance = [];
  xAxisData = [];

  // chart = {
  //   data: {
  //     line: [],
  //     bar: []
  //   },
  //   type: '',
  //   dataSet: {
  //     labels: [],
  //     datasets: []
  //   },
  //   yaxisname: null,
  //   options: null
  // };

  chart = {
    type: '',
    data: {},
    options: {},
  };

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

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef) {
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    this.xAxisData = [];
    this.getTripOnwardKmd(0);
    this.getTripLoadindTime(1);
    this.getTripUnLoadindTime(2);
    this.getTripLongHalt(3);
    this.getLongestLoadindSites(4);
    this.getTripSlowestOnward(6);
    this.getLongestUnLoadindDriver(5);
    this.getLongestUnLoadindSites(7);
    this.getTripGpsPerformance(8);
  }

  getTripOnwardKmd(index) {
    this.tripOnwardKmd = [];
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
    this.api.post('Tmgreport/GetTripOnwardKmd', params)
      .subscribe(res => {
        console.log('tripOnwardKmd:', res);
        this.tripOnwardKmd = res['data'];
        this.getlabelValue();
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getTripLoadindTime(index) {
    this.tripLoadindTime = [];
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
    this.api.post('Tmgreport/GetTripLoadindTime', params)
      .subscribe(res => {
        console.log('tripLoadindTime:', res);
        this.tripLoadindTime = res['data'];
        if (this.tripLoadindTime.length > 0) this.handleChart1();
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getTripUnLoadindTime(index) {
    this.tripUnLoadindTime = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetTripUnLoadindTime', params)
      .subscribe(res => {
        console.log('tripUnLoadindTime:', res);
        this.tripUnLoadindTime = res['data'];
        if (this.tripUnLoadindTime.length > 0) this.handleChart2();
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getTripLongHalt(index) {
    this.tripLongHalt = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.showLoader(index);
    this.api.post('Tmgreport/GetTripLoadindHalt', params)
      .subscribe(res => {
        console.log('tripLongHalt:', res);
        this.tripLongHalt = res['data'];
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getLongestLoadindSites(index) {

    this.longestLoadindSites = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetLongestLoadindSites', params)
      .subscribe(res => {
        console.log('longestLoadindSites:', res['data']);
        this.longestLoadindSites = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getLongestUnLoadindSites(index) {
    this.longestUnLoadindSites = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.showLoader(index);
    this.api.post('Tmgreport/GetLongestUnLoadindSites', params)
      .subscribe(res => {
        console.log('longestUnLoadindSites:', res);
        this.longestUnLoadindSites = res['data'];
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getTripSlowestOnward(index) {
    this.tripSlowestOnward = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTripSlowestOnward', params)
      .subscribe(res => {
        console.log('tripSlowestOnward:', res['data']);
        this.tripSlowestOnward = res['data'];
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getLongestUnLoadindDriver(index) {
    this.longestUnLoadindDriver = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetLongestUnLoadindDriver', params)
      .subscribe(res => {
        console.log('longestUnLoadindDriver:', res['data']);
        this.longestUnLoadindDriver = res['data'];
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }

  getTripGpsPerformance(index) {
    this.tripGpsPerformance = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTripGpsPerformance', params)
      .subscribe(res => {
        console.log('tripGpsPerformance:', res['data']);
        this.tripGpsPerformance = res['data'];
        this.hideLoader(index);;
      }, err => {
        this.hideLoader(index);;
        console.log('Err:', err);
      });
  }


  getlabelValue() {
    // if (this.tripOnwardKmd) {
    //   this.tripOnwardKmd.forEach((cmg) => {
    //     this.chart.data.line.push(cmg['Amount']);
    //     this.chart.data.bar.push(cmg['Onward KMS']);
    //     this.xAxisData.push(cmg['Period']);
    //   });

    this.handleChart();
    // }
  }

  // handleChart() {
  //   console.log("xAxis", this.chart.data.line,this.chart.data.bar,this.xAxisData);
  //   let data = {
  //     labels: this.xAxisData,
  //     datasets: []
  //   };

  //   data.datasets.push({
  //     type: 'line',
  //     label: 'Total(KMS)',
  //     borderColor: '#3d6fc9',
  //     backgroundColor: '#3d6fc9',
  //     pointHoverRadius: 8,
  //     pointHoverBackgroundColor: '#FFEB3B',
  //     fill: false,
  //     data: this.chart.data.line,
  //     yAxisID: 'y-axis-2'
  //   });

  //   data.datasets.push({
  //     type: 'bar',
  //     label: 'Onward (KMS)',
  //     borderColor: '#ed7d31',
  //     backgroundColor: '#ed7d31',
  //     fill: false,
  //     data: this.chart.data.bar.map(value => { return value.toFixed(2) }),
  //     pointHoverRadius: 8,
  //     pointHoverBackgroundColor: '#FFEB3B',
  //     yAxisID: 'y-axis-1',
  //     yAxisName: 'Count',
  //   });

  //   this.chart = {
  //     data: {
  //       line: [],
  //       bar: []
  //     },
  //     type: 'bar' ,
  //     dataSet: data,
  //     yaxisname: "Average Count",
  //     options: this.setChartOptions()
  //   };

  // }

  setChartOptions() {
    let options = {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      legend: {
        position: 'bottom',
        display: true
      },
      tooltips: {
        mode: 'index',
        intersect: 'true'
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
        yAxes: [],
        xAxes: [{
          scaleLabel: {
            display: true,
            // labelString: 'Months',
            fontSize: 17
          },
        }],
      }
    }

    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Onward KMS',
        fontSize: 17
      },
      ticks: { beginAtZero: true, min: 0 },
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',

    });
    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Total KMS',
        fontSize: 17,
      },
      type: 'linear',
      display: true,
      position: 'right',
      id: 'y-axis-2',
      gridLines: {
        drawOnChartArea: false,
      },
    });
    return options;
  }

  handleChart() {
    let yaxis = [];
    let xaxis = [];
    this.tripOnwardKmd.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Onward KMs']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart", xaxis, yaxis);
    this.chart.type = 'bar'
    this.chart.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Onward KMs',
          data: yaxisObj.scaleData,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
      this.chart.options = {
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },
        scaleLabel: {
          display: true,
          labelString: 'Onward KMS' + yaxisObj.yaxisLabel,
          fontSize: 17,
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
              labelString: 'Onward KMS' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize },//beginAtZero: true,min:0, 
            suggestedMin: yaxisObj.minValue,
          },


          ]
        }
        // scales: {
        //   yAxes: [{
        //     ticks: { stepSize: 50000},
        //   }]
        //  },

      };


  }

  handleChart1() {
    let yaxis = [];
    let xaxis = [];
    this.tripLoadindTime.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Loading Duration(hrs)']);
    });

    console.log('trip loading time : ', this.tripLoadindTime);
    console.log('y axis data:', yaxis);
    
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart1", xaxis, yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Hrs.)',
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
              labelString: 'Time (in Hrs.)' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize },//beginAtZero: true,min:0,
            suggestedMin: yaxisObj.minValue,
          }
          ]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems, data) {
              console.log("tooltipItems", tooltipItems, "data", data);
              let tti = ('' + tooltipItems.yLabel).split(".");
              let min = tti[1] ? parseInt(tti[1]) * 6 : '00';
              return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
            }
          }
        },
        // scales: {
        //   yAxes: [{
        //     ticks: { stepSize: 50000},
        //     suggestedMin : 0,
        //     max : 100
        //   }]
        //  },

      };

  }

  handleChart2() {
    let yaxis = [];
    let xaxis = [];
    this.tripUnLoadindTime.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Unloading Duration(hrs)']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart2", xaxis, yaxis);
    this.chart2.type = 'line'
    this.chart2.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Hrs)',
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
              labelString: 'Time (in Hrs.)' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize }, //beginAtZero: true,min:0,
            suggestedMin: yaxisObj.minValue,
          }]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItems, data) {
              console.log("tooltipItems", tooltipItems, "data", data);
              let tti = ('' + tooltipItems.yLabel).split(".");
              let min = tti[1] ? parseInt(tti[1]) * 6 : '00';
              return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
            }
          }
        },
      };
  }
  getDetials(url, params, value = 0, type = 'days') {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },

      title: 'Details'
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
    let outers = document.getElementsByClassName("outer");
    outers[index].lastChild.remove();
  }


  chart1Clicked(event) {

    let Date = this.tripLoadindTime[event[0]._index]._id;
    console.log('event[0]._index 1', event[0]._index, event[0], Date);
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
      isadmin: false,
      isfo: false,
      xid: parseDate,
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
    this.getDetials('Tmgreport/GetTripLoadindTime', params)
  }
  chart2Clicked(event) {

    let Date = this.tripOnwardKmd[event[0]._index]._id;
    console.log('event[0]._index 2', event[0]._index, event[0], Date);
    this.passingIdChart2Data(Date);
  }

  passingIdChart2Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: false,
      isfo: false,
      xid: parseDate,
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
    this.getDetials('Tmgreport/GetTripOnwardKmd', params)
  }
  chart3Clicked(event) {

    let Date = this.tripUnLoadindTime[event[0]._index]._id;
    console.log('event[0]._index 1', event[0]._index, event[0], Date);
    this.passingIdChart3Data(Date);
  }

  passingIdChart3Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: false,
      isfo: false,
      xid: parseDate,
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
    this.getDetials('Tmgreport/GetTripUnLoadindTime', params)
  }
}
