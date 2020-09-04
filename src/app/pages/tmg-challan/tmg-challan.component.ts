import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tmg-challan',
  templateUrl: './tmg-challan.component.html',
  styleUrls: ['./tmg-challan.component.scss']
})
export class TmgChallanComponent implements OnInit {
  challansMonthGraph = [];
  challanStateWise = [];
  challansMostAged = [];
  challansLatest = [];
  challansdrivarcount = [];
  challansdrivaramount = [];
  xAxisData = [];
  // yAxisDataL = [];
  // yAxisDataR = [];
  // chart = {
  //   type: 'line',
  //   plugins: [],
  //   lineWidth: 0,
  //   data: null,
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     legend: {
  //       display: true
  //     },
  //   },

  // };

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

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.getChallansMonthGraph();
    this.getChallansMostAged();
    this.getChallansLatest();
    this.getChallansdrivarcount();
    this.getChallansdrivaramount();
    this.getChallansstatewize();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.xAxisData = [];
    this.getChallansMonthGraph();
    this.getChallansMostAged();
    this.getChallansLatest();
    this.getChallansdrivarcount();
    this.getChallansdrivaramount();
    this.getChallansstatewize();
  }

  getChallansMonthGraph() {
    this.challansMonthGraph = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate)
    };
    this.api.post('Tmgreport/GetChallansMonthGraph', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('challansMonthGraph:', res);
        this.challansMonthGraph = res['data'];
        this.getlabelValue();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getChallansMostAged() {
    this.challansMostAged = [];
    ++this.common.loading;
    let params = { totalrecord: 3 };
    this.api.post('Tmgreport/GetChallansMostAged', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('challansMostAged:', res);
        this.challansMostAged = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getChallansLatest() {
    this.challansLatest = [];
    let params = { totalrecord: 3 };
    ++this.common.loading;
    this.api.post('Tmgreport/GetChallansLatestChallans', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('challansLatest:', res);
        this.challansLatest = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getChallansdrivarcount() {
    this.challansdrivarcount = [];
    let params = { totalrecord: 3 };
    ++this.common.loading;
    this.api.post('Tmgreport/GetChallansdrivarcount', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('challansdrivarcount:', res);
        this.challansdrivarcount = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getChallansdrivaramount() {
    this.challansdrivaramount = [];
    let params = { totalrecord: 3 };
    ++this.common.loading;
    this.api.post('Tmgreport/GetChallansdrivaramount', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('challansdrivaramount:', res);
        this.challansdrivaramount = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getChallansstatewize() {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    this.challanStateWise = [];
    ++this.common.loading;
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate)
    };
    this.api.post('Tmgreport/getChallansstatewize', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        this.challanStateWise = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
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
    console.log("xAxis", this.chart.data.line,this.chart.data.bar,this.xAxisData);
    // this.chart.type = 'bar'
    // this.chart.data = {
    //   labels: this.xAxisData,
    //   datasets: [
    //     {
    //       label: 'Count',
    //       data: this.yAxisDataL,
    //       backgroundColor: "#0074D9"
    //     },

    //     {
    //       label: 'Amount',
    //       data: this.yAxisDataR,
    //       type: 'line',
    //       fill: false,
    //     },
    //   ]
    // };
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
      data: this.chart.data.line,
      yAxisID: 'y-axis-2'
    });

    data.datasets.push({
      type: 'bar',
      label: 'count',
      borderColor: '#386ac4',
      backgroundColor: '#386ac4',
      fill: false,
      data: this.chart.data.bar.map(value => { return value.toFixed(2) }),
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
      type: 'bar' ,
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
        display:  true
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
            labelString: 'Months',
            fontSize: 17
          },
        }],
      }
    }

    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Count',
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
          labelString: 'Amount',
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
}
