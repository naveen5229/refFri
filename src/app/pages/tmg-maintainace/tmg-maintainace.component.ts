import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import * as _ from "lodash";

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'tmg-maintainace',
  templateUrl: './tmg-maintainace.component.html',
  styleUrls: ['./tmg-maintainace.component.scss']
})
export class TmgMaintainaceComponent implements OnInit {
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
    this.api.post('Tmgreport/GetMaintainanceworktrend', params)
      .subscribe(res => {
        console.log('challansMonthGraph:', res);
        this.challansMonthGraph = res['data'];
        this.hideLoader(index);
        this.handleChart5();
        
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }


  handleChart5() {
    let yaxis = [];
    let xaxis = [];
    let executives = _.groupBy(this.challansMonthGraph, 'Month');
    let periods = _.groupBy(this.challansMonthGraph, 'flag');
    let newdatasets = Object.keys(periods)
      .map(period => {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        yaxis.push(...periods[period].map(item => item['Count']))
        return {
          label: period,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          data: periods[period].map(item => item['Count']),
          linedata: periods[period].map(item => item['Amount']),
        }
      });
    console.log('DataSets:', newdatasets);
    console.log("handleChart5", xaxis, yaxis);
    this.chart5.type = 'bar';
    let oneresults = [ ...newdatasets[0].linedata, ...newdatasets[1].linedata];
    console.log('oneresults',oneresults);
    this.chart5.data = {
      labels: Object.keys(executives),
      "datasets": [
        { "data": newdatasets[0].data, "label": newdatasets[0].label,backgroundColor: "#386ac4", borderColor: "#386ac4",borderWidth: 1 },
        { "data": newdatasets[1].data, "label": newdatasets[1].label,backgroundColor: "#6aa225", borderColor: "#6aa225",borderWidth: 1 },
        { "data": oneresults, "label": "Cost", "type": "line",fill: false,  borderColor: '#ed7d31',
        backgroundColor: '#ed7d31',pointHoverRadius: 8,}
      ],
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
            labelString: 'Count Services' + chartobj.yaxisLabel
          },
          display: true,
          position: 'left',
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
            return (tooltipItems.datasetIndex == 2)?tooltipItems.xLabel + " ( " + tti[0] + " thousand. )":tooltipItems.xLabel + " ( " + tti[0] + " )";
           // return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " thousand. )";
          }
        }
      },
    };
  }

  chart5Clicked(event) {
    console.log('chart 5 event is: ', event);
    console.log('passingDataInsideChart5Modal :', this.challansMonthGraph[event[0]._index]._adminusers_id);
    let xid = event[0]._index;
    //let xid = this.callsSupervisorUnLoadingTat[event[0]._index]._id;
    let isFoId = this.challansMonthGraph[(event[0]._index + 1)]._monthyr;
    let executives = _.groupBy(this.challansMonthGraph, '_monthyr');
    let newdatasets = Object.keys(executives)
      .map(period => {
        return period;
      });
    console.log('DataSets:', newdatasets,xid, newdatasets[xid]);

    console.log('trendata ',isFoId,xid,this.challansMonthGraph,executives);
    this.passingDataInsideChart5Modal(xid, newdatasets[xid]);
  }

  passingDataInsideChart5Modal(id, isFoId) {
    let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 15,
      isadmin: true,
      stepno:3,
      xid: isFoId,
    };
    console.log('params :', params);
    this.getDetials('Tmgreport/GetMaintainanceworktrend', params)
  }
  getChallansMostAged(index) {
    this.challansMostAged = [];
    this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 90));
    let endDate = new Date();
    let params = { totalrecord: 3 ,
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
    };
    this.api.post('Tmgreport/GetMaintainancevehicledelay', params)
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
    let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
    let endDate = new Date();
    let params = { totalrecord: 3 ,
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetVehicleMaintainancelongperiod', params)
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
    let startDate = new Date(new Date().setDate(new Date().getDate() - 90));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
     
    };

   
     this.showLoader(index);
    this.api.post('Tmgreport/GetVehicleMaintainancereportcount', params)
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
    let startDate = new Date(new Date().setDate(new Date().getDate() - 90));
    let endDate = new Date();
    let params = {
      totalrecord: 3,
      fromdate:this.common.dateFormatter1(startDate),
      todate: this.common.dateFormatter1(endDate)
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetVehicleMaintainancereportworkshopcost', params)
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
    let startDate = new Date(new Date().setDate(new Date().getDate() - 90));
    let endDate = new Date();
    this.challanStateWise = [];
     this.showLoader(index);
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate)
    };
    this.api.post('Tmgreport/GetVehicleMaintainancereportcost', params)
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

    console.log('this.yaxisObj1.minValue',this.yaxisObj1.minValue);
    console.log('this.yaxisObj2.minValue',this.yaxisObj2.minValue);

    options.scales.yAxes.push({
      scaleLabel: {
        display: true,
        labelString: 'Count of Services'+this.yaxisObj1.yaxisLabel,
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
        labelString: 'Cost '+this.yaxisObj2.yaxisLabel,
        fontSize: 16,
      },
           ticks: { stepSize: (this.yaxisObj2.gridSize) ,  beginAtZero: true}, //beginAtZero: true,min:0,
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
    try {
      let outers = document.getElementsByClassName("outer");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}

