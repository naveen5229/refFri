import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  yaxisObj1 = null;
  yaxisObj2=null;

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
    this.getChallansMonthGraph(0);
    this.getChallansMostAged(1);
    this.getChallansLatest(2);
    this.getChallansdrivarcount(4);
    this.getChallansdrivaramount(5);
    this.getChallansstatewize(3);
  }

  getChallansMonthGraph(index) {
    this.challansMonthGraph = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate)
    };
    this.api.post('Tmgreport/GetChallansMonthGraph', params)
      .subscribe(res => {
        console.log('challansMonthGraph:', res);
        this.challansMonthGraph = res['data'];
        this.hideLoader(index);
        this.getlabelValue();
        
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getChallansMostAged(index) {
    this.challansMostAged = [];
     this.showLoader(index);
    let params = { totalrecord: 3 };
    this.api.post('Tmgreport/GetChallansMostAged', params)
      .subscribe(res => {
        console.log('challansMostAged:', res);
        this.challansMostAged = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getChallansLatest(index) {
    this.challansLatest = [];
    let params = { totalrecord: 3 };
     this.showLoader(index);
    this.api.post('Tmgreport/GetChallansLatestChallans', params)
      .subscribe(res => {
        console.log('challansLatest:', res);
        this.challansLatest = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getChallansdrivarcount(index) {
    this.challansdrivarcount = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3 
    };

   
     this.showLoader(index);
    this.api.post('Tmgreport/GetChallansdrivarcount', params)
      .subscribe(res => {
        console.log('challansdrivarcount:', res);
        this.challansdrivarcount = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getChallansdrivaramount(index) {
    this.challansdrivaramount = [];
    let startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    let endDate = new Date();
    let params = {
      totalrecord: 3,
      fromdate:this.common.dateFormatter1(startDate),
      todate: this.common.dateFormatter1(endDate)
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetChallansdrivaramount', params)
      .subscribe(res => {
        console.log('challansdrivaramount:', res);
        this.challansdrivaramount = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getChallansstatewize(index) {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    this.challanStateWise = [];
     this.showLoader(index);
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate)
    };
    this.api.post('Tmgreport/getChallansstatewize', params)
      .subscribe(res => {
        console.log('Res:', res['data']);
        this.challanStateWise = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
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
    this.yaxisObj1=this.common.chartScaleLabelAndGrid(this.chart.data.bar);
    this.yaxisObj2=this.common.chartScaleLabelAndGrid(this.chart.data.line);
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

    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Count of Challans'+this.yaxisObj1.yaxisLabel,
        fontSize: 16
      },
      ticks: { stepSize: this.yaxisObj1.gridSize}, //beginAtZero: true,min:0,
      suggestedMin : this.yaxisObj1.minValue,
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',

    });
    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Challan Amount '+this.yaxisObj2.yaxisLabel,
        fontSize: 16,
      },
           ticks: { stepSize: this.yaxisObj2.gridSize}, //beginAtZero: true,min:0,
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

  getDetials(url, params, value = 0,type='days') {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },
  
      title: 'Details'
    }
    if (value) {
      let startDate = type == 'months'? new Date(new Date().setMonth(new Date().getMonth() - value)): new Date(new Date().setDate(new Date().getDate() - value));
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
}
