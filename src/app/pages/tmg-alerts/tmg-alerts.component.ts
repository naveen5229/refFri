import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
 
@AutoUnsubscribe()
@Component({
  selector: 'tmg-alerts',
  templateUrl: './tmg-alerts.component.html',
  styleUrls: ['./tmg-alerts.component.scss']
})
export class TmgAlertsComponent implements OnInit {
  alertAckTat = [];
  alertCallTat = [];
  alertVscTat = [];
  alertNotAck = [];
  alertNotCall = [];
  alertOpen = [];
  alertWorstCallTat = [];
  alertVscPending = [];
  alertVscWorst = []
  // xAxisData = [];
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
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit() {
    this.refresh();
  }

  refresh() {
    // this.xAxisData = [];
    this.getAlertAckTat(0);
    this.getAlertCallTat(1);
    this.getAlertVscTat(2);
    this.getAlertNotAck(3);
    this.getAlertNotCall(4);
    this.getAlertOpen(6);
    this.getAlertVscPending(5);
    this.getAlertWorstCallTat(7);
    this.getAlertVscWorst(8);
  }

  getAlertAckTat(index) {
    this.alertAckTat = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 1,
      stepno:0
    };
    this.api.post('Tmgreport/GetAlertAckTat', params)
      .subscribe(res => {
        console.log('alertAckTat:', res);
        this.alertAckTat = res['data'];
        if(this.alertAckTat.length>0) this.handleChart();
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertCallTat(index) {
    this.alertCallTat = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 1,
      stepno:0
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetAlertCallTat', params)
      .subscribe(res => {
        console.log('alertCallTat:', res);
        this.alertCallTat = res['data'];
        if(this.alertCallTat.length>0) this.handleChart1();
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertVscTat(index) {
    this.alertVscTat = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 1,
      stepno:0
    };
    this.api.post('Tmgreport/GetAlertVscTat', params)
      .subscribe(res => {
        console.log('alertVscTat:', res);
        this.alertVscTat = res['data'];
        if(this.alertVscTat.length>0) this.handleChart2();
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertNotAck(index) {
    this.alertNotAck = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetAlertNotAck', params)
      .subscribe(res => {
        console.log('alertNotAck:', res);
        this.alertNotAck = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertNotCall(index){
    this.alertNotCall = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertNotCall', params)
      .subscribe(res => {
        console.log('alertNotCall:', res['data']);
        this.alertNotCall = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertVscPending(index){
    this.alertVscPending = [];
     this.showLoader(index);
    let startDate =new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertVscPending', params)
      .subscribe(res => {
        console.log('alertVscPending:', res['data']);
        this.alertVscPending = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertOpen(index) {
    this.alertOpen = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetAlertOpen', params)
      .subscribe(res => {
        console.log('alertOpen:', res);
        this.alertOpen = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertWorstCallTat(index) { 
    this.alertWorstCallTat = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));;
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertWorstCallTat', params)
      .subscribe(res => {
        console.log('alertWorstCallTat:', res['data']);
        this.alertWorstCallTat = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getAlertVscWorst(index) { 
    this.alertVscWorst = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertVscWorst', params)
      .subscribe(res => {
        console.log('alertVscWorst:', res['data']);
        this.alertVscWorst = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  handleChart(){
    let yaxis = [];
    let xaxis = [];
    this.alertAckTat.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Ack TAT(Hrs)']);
    });
    console.log("handleChart",xaxis,yaxis);
    this.chart.type = 'line'
    this.chart.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Ack TAT(Hrs)',
          data: yaxis,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
    this.chart.options= {
      responsive: true,
      legend: {
        position: 'bottom',
        display:  false
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
            labelString: 'Ack TAT (in Hrs.)'
          }
        }]
      } ,
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function (tooltipItems, data) {
            console.log('tooltipItems', tooltipItems);
            // let tti = ('' + tooltipItems.yLabel).split(".");
            // console.log('tooltipItems:s', tooltipItems.yLabel * 0.6);
            // let min = tti[1] ? String(parseInt(tti[1]) * .60).substring(0, 2) : '00';
            // console.log("tooltipItems", min, parseInt(tti[1]) + .0, parseInt("0" + (tti[1])));
            let x = tooltipItems.yLabel;
          // let z = (parseFloat(x.toFixed()) + parseFloat((x % 1).toFixed(10)) * 0.6).toString();
          // z = z.slice(0, z.indexOf('.') + 3).split('.').join(':');
          //   return tooltipItems.xLabel + " ( " + z + " Hrs. )";
          let z = (parseFloat((x % 1).toFixed(10)) * 0.6).toString();
          z = z.slice(0, z.indexOf('.') + 3).split('.').join(':') ;
            let final = x.toString().split('.')[0] +':'+ z.split(':')[1];

            return tooltipItems.xLabel + " ( " + final + " Hrs. )";
          }
        }
      },

    };
  }
 

  handleChart1(){
    let yaxis = [];
    let xaxis = [];
    this.alertCallTat.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(((tlt['Call TAT(HH:MM)']) ? tlt['Call TAT(HH:MM)'] : 0));
    });
    console.log("handleChart1",xaxis,yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Mins.)',
          data: yaxis,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
    this.chart1.options= {
      responsive: true,
      legend: {
        position: 'bottom',
        display:  false
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
            labelString: 'Time (in Mins.)'
          }
        }]
      } ,
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function (tooltipItems, data) {
            console.log("tooltipItems", tooltipItems, "data", data);
            // let tti = ('' + tooltipItems.yLabel).split(".");
            // let min = tti[1] ? String(parseInt(tti[1]) * 6).substring(0, 2) : '00';
            // return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
            let x = tooltipItems.yLabel;
            // let z = (parseFloat(x.toFixed()) + parseFloat((x % 1).toFixed(10)) * 0.6).toString();
            // z = z.slice(0, z.indexOf('.') + 3).split('.').join(':');

            let z = (parseFloat((x % 1).toFixed(10)) * 0.6).toString();
            z = z.slice(0, z.indexOf('.') + 3).split('.').join(':') ;
              let final = x.toString().split('.')[0] +':'+ z.split(':')[1];

              return tooltipItems.xLabel + " ( " + final + " Hrs. )";
          }
        }
      },
    };
  }
  

  handleChart2(){
    let yaxis = [];
    let xaxis = [];
    this.alertVscTat.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push((tlt['TAT(Hrs)']) ? tlt['TAT(Hrs)'] :0);
    });
    console.log("handleChart2",xaxis,yaxis);
    this.chart2.type = 'line'
    this.chart2.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Mins)',
          data: yaxis,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
  this.chart2.options= {
    responsive: true,
    legend: {
      position: 'bottom',
      display:  false
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
          labelString: 'Time (in Mins.)'
        }
      }]
    } ,
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          console.log('tooltipItems', tooltipItems);
          // let tti = ('' + tooltipItems.yLabel).split(".");
          // console.log('tooltipItems:s', tooltipItems.yLabel * 0.6);
          // let min = tti[1] ? String(parseInt(tti[1]) * .60).substring(0, 2) : '00';
          // console.log("tooltipItems", min, parseInt(tti[1]) + .0, parseInt("0" + (tti[1])));
          let x = tooltipItems.yLabel;
         // let z = (parseFloat(x.toFixed()) + parseFloat((x % 1).toFixed(10)) * 0.6).toString();
         // z = z.slice(0, z.indexOf('.') + 3).split('.').join(':');
         //   return tooltipItems.xLabel + " ( " + z + " Hrs. )";
          let z = (parseFloat((x % 1).toFixed(10)) * 0.6).toString();
          z = z.slice(0, z.indexOf('.') + 3).split('.').join(':') ;
          let final = x.toString().split('.')[0] +':'+ z.split(':')[1];
          return tooltipItems.xLabel + " ( " + final + " Hrs. )";
        }
      }
    },
  };
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

chart1Clicked(event) {

  let Date = this.alertAckTat[event[0]._index].Date;
  console.log('event[0]._index', event[0]._index, event[0], Date);
  this.passingIdChart1Data(Date);
}

passingIdChart1Data(parseDate) {
  //   this.showLoader(id);
  let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  let endDate = new Date();
  let params = {
    fromdate: this.common.dateFormatter(startDate),
    todate: this.common.dateFormatter(endDate),
    groupdays: 1,
    date: parseDate,
    stepno:1
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
  this.getDetials('Tmgreport/GetAlertAckTat', params)
}
chart2Clicked(event) {

  let Date = this.alertCallTat[event[0]._index].Date;
  console.log('event[0]._index', event[0]._index, event[0], Date);
  this.passingIdChart2Data(Date);
}

passingIdChart2Data(parseDate) {
  //   this.showLoader(id);
  let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  let endDate = new Date();
  let params = {
    fromdate: this.common.dateFormatter(startDate),
    todate: this.common.dateFormatter(endDate),
    groupdays: 1,
    date: parseDate,
    stepno:1
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
  this.getDetials('Tmgreport/GetAlertCallTat', params)
}

chart3Clicked(event) {

  let Date = this.alertVscTat[event[0]._index].Date;
  console.log('event[0]._index', event[0]._index, event[0], Date);
  this.passingIdChart3Data(Date);
}

passingIdChart3Data(parseDate) {
  //   this.showLoader(id);
  let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  let endDate = new Date();
  let params = {
    fromdate: this.common.dateFormatter(startDate),
    todate: this.common.dateFormatter(endDate),
    groupdays: 1,
    date: parseDate,
    stepno:1
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
  this.getDetials('Tmgreport/GetAlertVscTat', params)
}
}


