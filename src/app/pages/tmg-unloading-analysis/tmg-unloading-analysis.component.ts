import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'tmg-unloading-analysis',
  templateUrl: './tmg-unloading-analysis.component.html',
  styleUrls: ['./tmg-unloading-analysis.component.scss']
})
export class TmgUnloadingAnalysisComponent implements OnInit {
  unloadingtat = [];
  unloadingWorstDestination = [];
  unLoadingWorstTransportar = [];
  unLoadingWorstTransportar1month = [];
  unLoadingWorstConsignee = [];
  unLoadingWorstConsignee1month = [];
  xAxisData = [];

  
  chart = {
    type: '',
    data: {},
    options: {},
  };

 

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getUnloadingtat();
    this.getUnloadingWorstDestination();
    this.getUnLoadingWorstTransportar();
    this.getUnLoadingWorstTransportar1month();
    this.getUnLoadingWorstConsignee();
    this.getUnLoadingWorstConsignee1month();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.xAxisData = [];
    this.getUnloadingtat();
    this.getUnloadingWorstDestination();
    this.getUnLoadingWorstTransportar();
    this.getUnLoadingWorstTransportar1month();
    this.getUnLoadingWorstConsignee();
    this.getUnLoadingWorstConsignee1month();
  }

  getUnloadingtat() {
    this.unloadingtat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetUnLoadingtat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('getUnloadingtat:', res);
        this.unloadingtat = res['data'];
        this.getlabelValue();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getlabelValue() {
    // if (this.getUnloadingtat) {
    //   this.getUnloadingtat.forEach((cmg) => {
    //     this.chart.data.line.push(cmg['Amount']);
    //     this.chart.data.bar.push(cmg['Onward KMS']);
    //     this.xAxisData.push(cmg['Period']);
    //   });

    this.handleChart();
    // }
  }

  getUnLoadingWorstTransportar1month() {
    this.unLoadingWorstTransportar1month = [];
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/getUnLoadingWorstTransportar', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('UnLoadingWorstTransportar1month:', res);
        this.unLoadingWorstTransportar1month = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }
  
  getUnLoadingWorstTransportar() {
    this.unLoadingWorstTransportar = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/getUnLoadingWorstTransportar', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('UnLoadingWorstTransportar:', res['data']);
        this.unLoadingWorstTransportar = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getUnloadingWorstDestination() {
    this.unloadingWorstDestination = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetUnLoadingWorstDestination', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('UnloadingWorstDestination:', res['data']);
        this.unloadingWorstDestination = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  

  getUnLoadingWorstConsignee() {
    this.unLoadingWorstConsignee = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetUnLoadingWorstConsignee', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('UnLoadingWorstConsignee:', res['data']);
        this.unLoadingWorstConsignee = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getUnLoadingWorstConsignee1month() {
    this.unLoadingWorstConsignee1month = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetUnLoadingWorstConsignee', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('UnLoadingWorstConsignee:', res['data']);
        this.unLoadingWorstConsignee1month = res['data'];
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
    this.unloadingtat.map(tlt => {
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
