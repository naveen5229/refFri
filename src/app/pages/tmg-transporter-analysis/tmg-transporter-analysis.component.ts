import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'tmg-transporter-analysis',
  templateUrl: './tmg-transporter-analysis.component.html',
  styleUrls: ['./tmg-transporter-analysis.component.scss']
})
export class TmgTransporterAnalysisComponent implements OnInit {
  tripOnwardKmd = [];
  transportarLoadingTat = [];
  transportarSlowestUnloadingtat = [];
  transportarSlowestOnward = [];
  transportarSlowestUnload = [];
  transportarSlowestLoad = [];
  transportarSlowestOnward7days = [];
  transportarSlowestUnload7days = [];
  transportarSlowestLoad7days = [];
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
    private modalService: NgbModal) {
    this.getTripOnwardKmd();
    this.getTransportarLoadingTat();
    this.getTransportarSlowestUnloadingtat();
    this.getTransportarSlowestOnward();
    this.getTransportarSlowestUnload();
    this.getTransportarSlowestLoad();
    this.getTransportarSlowestOnward7days();
    this.getTransportarSlowestUnload7days();
    this.getTransportarSlowestLoad7days();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.xAxisData = [];
    this.getTripOnwardKmd();
    this.getTransportarLoadingTat();
    this.getTransportarSlowestUnloadingtat();
    this.getTransportarSlowestOnward();
    this.getTransportarSlowestUnload();
    this.getTransportarSlowestLoad();
    this.getTransportarSlowestOnward7days();
    this.getTransportarSlowestUnload7days();
    this.getTransportarSlowestLoad7days();
  }

  getTripOnwardKmd() {
    this.tripOnwardKmd = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetTripOnwardKmd', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripOnwardKmd:', res);
        this.tripOnwardKmd = res['data'];
        this.getlabelValue();
      }, err => {
        --this.common.loading;
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

  getTransportarLoadingTat() {
    this.transportarLoadingTat = [];
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTransportarLoadingTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('GetTransportarLoadingTat:', res);
        this.transportarLoadingTat = res['data'];
        if (this.transportarLoadingTat.length > 0) this.handleChart1();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestUnloadingtat() {
    this.transportarSlowestUnloadingtat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTransportarSlowestUnloadingtat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('transportarSlowestUnloadingtat:', res);
        this.transportarSlowestUnloadingtat = res['data'];
        if (this.transportarSlowestUnloadingtat.length > 0) this.handleChart2();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestOnward() {
    this.transportarSlowestOnward = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 60));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTransportarSlowestOnward', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('transportarSlowestOnward:', res);
        this.transportarSlowestOnward = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestUnload() {

    this.transportarSlowestUnload = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 60));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTransportarSlowestUnload', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('transportarSlowestUnload:', res['data']);
        this.transportarSlowestUnload = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestUnload7days() {
    this.transportarSlowestUnload7days = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTransportarSlowestUnload', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('transportarSlowestUnload7days:', res);
        this.transportarSlowestUnload7days = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestLoad() {
    this.transportarSlowestLoad = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 60));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTransportarSlowestLoad', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('TransportarSlowestLoad:', res['data']);
        this.transportarSlowestLoad = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestOnward7days() {
    this.transportarSlowestOnward7days = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/getTransportarSlowestOnward', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('transportarSlowestOnward7days:', res['data']);
        this.transportarSlowestOnward7days = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTransportarSlowestLoad7days() {
    this.transportarSlowestLoad7days = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTransportarSlowestLoad', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('transportarSlowestLoad7days:', res['data']);
        this.transportarSlowestLoad7days = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }




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
            ticks: { stepSize: yaxisObj.gridSize },
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
    this.transportarLoadingTat.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Avg hrs']);
    });
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
            ticks: { stepSize: yaxisObj.gridSize },
            suggestedMin: yaxisObj.minValue,
          }
          ]
        }
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
    this.transportarSlowestUnloadingtat.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Avg hrs']);
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
            ticks: { stepSize: yaxisObj.gridSize },
            suggestedMin: yaxisObj.minValue,
          }]
        }
      };
    }
      getDetials(url,params){
        let dataparams = {
          view: {
            api: url,
            param: params,
            type:'post'
          },
          
          title: 'Details'
        }
        console.log("dataparams=",dataparams);
        this.common.handleModalSize('class', 'modal-lg', '1100');
        this.common.params = { data: dataparams };
        const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      }   
}
