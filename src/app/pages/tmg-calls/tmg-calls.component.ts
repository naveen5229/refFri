import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

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
  callsSupervisorUnLoadingTat = [];
  xAxisData = [];

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
    this.getCallsDrivar();
    this.getCallsSupervisorWiseNotRespod();
    this.getCallsNotRespod();
    this.getCallsSupervisorWiseTopWorstDriverCalls();
    this.getCallsSupervisorLoadingTat();
    this.getCallsSupervisorUnLoadingTat();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.xAxisData = [];
    this.getCallsDrivar();
    this.getCallsSupervisorWiseNotRespod();
    this.getCallsNotRespod();
    this.getCallsSupervisorWiseTopWorstDriverCalls();
    this.getCallsSupervisorLoadingTat();
    this.getCallsSupervisorUnLoadingTat();
  }

  getCallsDrivar() {
    this.callsDrivar = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetCallsDrivar', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('callsDrivar:', res);
        this.callsDrivar = res['data'];
        if (this.callsDrivar.length > 0) this.handleChart1();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getCallsSupervisorWiseNotRespod() {
    this.callsSupervisorWiseNotRespod = [];
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      totalrecord: 7
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetCallsSupervisorWiseNotRespod', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('callsSupervisorWiseNotRespod:', res);
        this.callsSupervisorWiseNotRespod = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getCallsNotRespod() {
    this.callsNotRespod = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetCallsNotRespod', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripUnLoadindTime:', res);
        this.callsNotRespod = res['data'];
        if (this.callsNotRespod.length > 0) this.handleChart2();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getCallsSupervisorWiseTopWorstDriverCalls() {
    this.callsSupervisorWiseTopWorstDriverCalls = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      totalrecord: 3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetCallsSupervisorWiseTopWorstDriverCalls', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('callsSupervisorWiseTopWorstDriverCalls:', res);
        this.callsSupervisorWiseTopWorstDriverCalls = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getCallsSupervisorLoadingTat() {
    this.callsSupervisorLoadingTat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetCallsSupervisorLoadingTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('callsSupervisorLoadingTat:', res);
        this.callsSupervisorLoadingTat = res['data'];
        if (this.callsSupervisorLoadingTat.length > 0) this.handleChart3();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getCallsSupervisorUnLoadingTat() {
    this.callsSupervisorUnLoadingTat = [];
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 15
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetCallsSupervisorUnLoadingTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('callsSupervisorUnLoadingTat:', res);
        this.callsSupervisorUnLoadingTat = res['data'];
        if (this.callsSupervisorUnLoadingTat.length > 0) this.handleChart5();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertWorstCallTat() {
    this.callsNotRespod = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 15
    };
    this.api.post('Tmgreport/GetAlertWorstCallTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripUnLoadindTime:', res);
        this.callsNotRespod = res['data'];
        if (this.callsNotRespod.length > 0) this.handleChart4();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  handleChart1() {
    let yaxis = [];
    let xaxis = [];
    this.callsDrivar.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Calls Percent']);
    });
    console.log("handleChart1", xaxis, yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'count',
          data: yaxis,
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

      };
  }


  handleChart2() {
    let yaxis = [];
    let xaxis = [];
    this.callsNotRespod.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Counts']);
    });
    console.log("handleChart2", xaxis, yaxis);
    this.chart2.type = 'line'
    this.chart2.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'counts',
          data: yaxis,
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
    this.chart3.options = {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMax: 5
          }
        }]
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

    };
  }

  handleChart4() {
    let yaxis = [];
    let xaxis = [];
    let executives = _.groupBy(this.callsSupervisorLoadingTat, 'Executive');
    let periods = _.groupBy(this.callsSupervisorLoadingTat, 'Period');

    this.callsSupervisorLoadingTat.map(tlt => {
      xaxis.push('p');
      yaxis.push(tlt['value']);
    });


    let datasets = Object.keys(periods)
      .map(period => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
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
    this.chart3.options = {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMax: 5
          }
        }]
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

    };
  }

  handleChart5() {
    let yaxis = [];
    let xaxis = [];
    let executives = _.groupBy(this.callsSupervisorUnLoadingTat, 'Executive');
    let periods = _.groupBy(this.callsSupervisorUnLoadingTat, 'Period');
    let datasets = Object.keys(periods)
      .map(period => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
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
    this.chart5.options = {
      responsive: true,
      legend: {
        position: 'bottom',
        display: true
      },
      scales: {
        yAxes: [{
          ticks: {
            suggestedMax: 5
          }
        }]
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

    };
  }

  
}
