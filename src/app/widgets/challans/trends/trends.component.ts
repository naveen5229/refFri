import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'challan-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss']
})
export class TrendsComponent implements OnInit {
  challansMonthGraph = [];
  yaxisObj1 = null;
  yaxisObj2 = null;
  chart = {
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
  xAxisData = [];

  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getChallansMonthGraph();
  }

  getChallansMonthGraph() {
    this.challansMonthGraph = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate)
    };
    this.showLoader();
    this.api.post('Tmgreport/GetChallansMonthGraph', params)
      .subscribe(res => {
        this.hideLoader();
        console.log('challansMonthGraph:', res);
        this.challansMonthGraph = res['data'];
        this.getlabelValue();
      }, err => {
        this.hideLoader();
        console.log('Err:', err);
      });
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

  getlabelValue() {
    if (this.challansMonthGraph) {
      this.challansMonthGraph.forEach((cmg) => {
        this.chart.data.line.push(cmg['Amount']);
        this.chart.data.bar.push(cmg['Count']);
        this.xAxisData.push(cmg['Month']);
      });

      this.handleChart();
    }
  }

  handleChart() {
    this.yaxisObj1 = this.common.chartScaleLabelAndGrid(this.chart.data.bar);
    this.yaxisObj2 = this.common.chartScaleLabelAndGrid(this.chart.data.line);
    console.log("this.yaxisObj1", this.yaxisObj1, "this.yaxisObj2", this.yaxisObj2);
    let data = {
      labels: this.xAxisData,
      datasets: []
    };

    data.datasets.push({
      type: 'line',
      label: 'Amount',
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
      label: 'count',
      borderColor: '#386ac4',
      backgroundColor: '#386ac4',
      fill: false,
      data: this.yaxisObj1.scaleData.map(value => { return value.toFixed(2) }),
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#FFEB3B',
      yAxisID: 'y-axis-1',
      yAxisName: 'Count',
    });

    this.chart = {
      data: {
        line: [],
        bar: []
      },
      type: 'bar',
      dataSet: data,
      yaxisname: "Average Count",
      options: this.setChartOptions()
    };

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
      // tooltips: {
      //   mode: 'index',
      //   intersect: 'true'
      // },

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
            labelString: 'Months',
            fontSize: 17
          },
        }],
      }
    }

    console.log('this.yaxisObj1.minValue', this.yaxisObj1.minValue);
    console.log('this.yaxisObj2.minValue', this.yaxisObj2.minValue);

    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Count of Challans' + this.yaxisObj1.yaxisLabel,
        fontSize: 16
      },
      ticks: { stepSize: (this.yaxisObj1.gridSize), min: this.yaxisObj1.minValue - this.yaxisObj1.gridSize > 0 ? this.yaxisObj1.minValue - this.yaxisObj1.gridSize : 0 }, //beginAtZero: true,min:0,
      // suggestedMin : this.yaxisObj1.minValue,
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',

    });
    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Challan Amount ' + this.yaxisObj2.yaxisLabel,
        fontSize: 16,
      },
      ticks: { stepSize: (this.yaxisObj2.gridSize), beginAtZero: true }, //beginAtZero: true,min:0,
      suggestedMin: this.yaxisObj2.minValue,
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
  showLoader(index = 0) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("challan-4");
      let loader = document.createElement('div');
      loader.className = 'loader';
      console.log('show loader', index, outers[index]);
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index = 0) {
    try {
      let outers = document.getElementsByClassName("challan-4");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}
