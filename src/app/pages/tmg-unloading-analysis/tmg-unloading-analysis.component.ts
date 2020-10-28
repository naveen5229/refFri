import { isDataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
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
  xAxisData1 = [];
  yaxisObj1 = null;
  yaxisObj2=null;

  chart1 = {
    data: {
      line: [],
      bar: []
    },
    type: '',
    dataSet: {
      labels: [],
      datasets: []
    },
    yaxisname: "Month",
    options: null
  };
  
  
  chart = {
    type: '',
    data: {},
    options: {},
  };

 

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
   
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getUnloadingtat();
    this.getUnloadingWorstDestination();
    this.getUnLoadingWorstTransportar();
    this.getUnLoadingWorstTransportar1month();
    this.getUnLoadingWorstConsignee();
    this.getUnLoadingWorstConsignee1month();
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
        this.getlabelValue(params.fromdate,params.todate);
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getlabelValue(fromdate,todate) {
    // if (this.getUnloadingtat) {
    //   this.getUnloadingtat.forEach((cmg) => {
    //     this.chart.data.line.push(cmg['Amount']);
    //     this.chart.data.bar.push(cmg['Onward KMS']);
    //     this.xAxisData.push(cmg['Period']);
    //   });

    this.handleChart(fromdate,todate);
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
        this.getlabelValue1();
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




 
  handleChart(fromdate,todate) {
    let yaxis = [];
    let xaxis = [];
    let ids = [];
    this.unloadingtat.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Avg hrs']);
      ids.push(tlt['_id']);
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
        },
        onClick: (e, item) => {
          let idx = item[0]['_index'];
          // let xax = xaxis[idx];
          // let yax = yaxis[idx];
          let params = {
            stepno: 1,
            jsonparam: ids[idx],
            fromdate: fromdate,
            todate: todate,
            groupdays: 7
          }
          this.getDetials('Tmgreport/GetLoadingtat',params)

        }
        // scales: {
        //   yAxes: [{
        //     ticks: { stepSize: 50000},
        //   }]
        //  },

      };


  }

  getlabelValue1() {
    this.xAxisData1 = [];
    if (this.unloadingWorstDestination) {
      this.unloadingWorstDestination.forEach((cmg) => {
        this.chart1.data.line.push(cmg['detention_days']);
        this.chart1.data.bar.push(cmg['tripcount']);
        this.xAxisData1.push(cmg['destination']);
      });

      this.handleChart1();
    }
  }

  handleChart1() {
    this.yaxisObj1=this.common.chartScaleLabelAndGrid(this.chart1.data.bar);
    this.yaxisObj2=this.common.chartScaleLabelAndGrid(this.chart1.data.line);
    console.log("this.yaxisObj1", this.yaxisObj1, "this.yaxisObj2", this.yaxisObj2);
    let data = {
      labels: this.xAxisData1,
      datasets: []
    };

    data.datasets.push({
      type: 'line',
      label: 'Detention Days',
      borderColor: '#ed7d31',
      backgroundColor: '#ed7d31',
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#FFEB3B',
      fill: false,
      data: this.yaxisObj2.scaleData,
      yAxisID: 'y-axis-2'
    });

    data.datasets.push({
      type: 'bar',
      label: 'Count',
      borderColor: '#386ac4',
      backgroundColor: '#386ac4',
      fill: false,
      data: this.yaxisObj1.scaleData.map(value => { return value.toFixed(2) }),
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#FFEB3B',
      yAxisID: 'y-axis-1',
      yAxisName: 'Trips',
    });

    this.chart1 = {
      data: {
        line: [],
        bar: []
      },
      type: 'bar',  
      dataSet: data,
      yaxisname: "Count",
      options: this.setChartOptions1()
    };

  }

  setChartOptions1() {
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
            labelString: 'Location',
            fontSize: 17
          },
        }],
      }
    }

    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Count'+this.yaxisObj1.yaxisLabel,
        fontSize: 16
      },
      ticks: { stepSize: this.yaxisObj1.gridSize},
      suggestedMin : this.yaxisObj1.minValue,
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',

    });
    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Detention Days '+this.yaxisObj2.yaxisLabel,
        fontSize: 16,
      },
           ticks: { stepSize: this.yaxisObj2.gridSize},
          suggestedMin : this.yaxisObj2.minValue,
          // max : 100
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

  getDetials(url, params,days=0) {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },

      title: 'Details'
    }
    if(days){
      let startDate = new Date(new Date().setDate(new Date().getDate() - days));
      let endDate = new Date();
      dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
      dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
    }
    console.log("dataparams=", dataparams);
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
}
