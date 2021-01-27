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
      groupdays: 1
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
      groupdays: 1
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
      groupdays: 1
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
    };
  }
 

  handleChart1(){
    let yaxis = [];
    let xaxis = [];
    this.alertCallTat.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Call TAT(Hrs)']);
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
    };
  }
  

  handleChart2(){
    let yaxis = [];
    let xaxis = [];
    this.alertVscTat.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['TAT(Hrs)']);
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
  let outers = document.getElementsByClassName("outer");
  outers[index].lastChild.remove();
}
}


