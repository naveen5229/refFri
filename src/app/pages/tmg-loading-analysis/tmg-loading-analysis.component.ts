import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'tmg-loading-analysis',
  templateUrl: './tmg-loading-analysis.component.html',
  styleUrls: ['./tmg-loading-analysis.component.scss']
})
export class TmgLoadingAnalysisComponent implements OnInit {
  loadingtat = [];
  loadingAged = [];
  loadingSlowest = [];
  loadingSlowest7days = [];
  transportarSlowestLoad = [];
  xAxisData = [];

  
  chart = {
    type: '',
    data: {},
    options: {},
  };

 

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getLoadingtat();
    this.getLoadingAged();
    this.getLoadingSlowest();
    this.getLoadingSlowest7days();
    this.getTransportarSlowestLoad();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.xAxisData = [];
    this.getLoadingtat();
    this.getLoadingSlowest();
    this.getLoadingSlowest7days();
    this.getLoadingAged();
   
    this.getTransportarSlowestLoad();
  }

  getLoadingtat() {
    this.loadingtat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetLoadingtat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('GetLoadingtat:', res);
        this.loadingtat = res['data'];
        this.getlabelValue();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getlabelValue() {
    // if (this.GetLoadingtat) {
    //   this.GetLoadingtat.forEach((cmg) => {
    //     this.chart.data.line.push(cmg['Amount']);
    //     this.chart.data.bar.push(cmg['Onward KMS']);
    //     this.xAxisData.push(cmg['Period']);
    //   });

    this.handleChart();
    // }
  }

  getLoadingSlowest7days() {
    this.loadingSlowest7days = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/getLoadingSlowest', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('LoadingSlowest7days:', res);
        this.loadingSlowest7days = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }
  getLoadingSlowest() {
    this.loadingSlowest = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/getLoadingSlowest', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('loadingSlowest:', res['data']);
        this.loadingSlowest = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getLoadingAged() {
    this.loadingAged = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetLoadingAged', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('loadingAged:', res['data']);
        this.loadingAged = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  

  getTransportarSlowestLoad() {
    this.transportarSlowestLoad = [];
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
        console.log('transportarSlowestLoad:', res['data']);
        this.transportarSlowestLoad = res['data'];
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
    this.loadingtat.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Avg hrs']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart", xaxis, yaxis);
    this.chart.type = 'bar'
    this.chart.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Avg hrs',
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
          labelString: 'Avg hrs' + yaxisObj.yaxisLabel,
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
              labelString: 'Avg hrs' + yaxisObj.yaxisLabel
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


}
