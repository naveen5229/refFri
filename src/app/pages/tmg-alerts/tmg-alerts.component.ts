import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    this.getAlertAckTat();
    this.getAlertCallTat();
    this.getAlertVscTat();
    this.getAlertNotAck();
    this.getAlertNotCall();
    this.getAlertOpen();
    this.getAlertVscPending();
    this.getAlertWorstCallTat();
    this.getAlertVscWorst();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    // this.xAxisData = [];
    this.getAlertAckTat();
    this.getAlertCallTat();
    this.getAlertVscTat();
    this.getAlertNotAck();
    this.getAlertNotCall();
    this.getAlertOpen();
    this.getAlertVscPending();
    this.getAlertWorstCallTat();
    this.getAlertVscWorst();
  }

  getAlertAckTat() {
    this.alertAckTat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 1
    };
    this.api.post('Tmgreport/GetAlertAckTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertAckTat:', res);
        this.alertAckTat = res['data'];
        if(this.alertAckTat.length>0) this.handleChart();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertCallTat() {
    this.alertCallTat = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 1
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetAlertCallTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertCallTat:', res);
        this.alertCallTat = res['data'];
        if(this.alertCallTat.length>0) this.handleChart1();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertVscTat() {
    this.alertVscTat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 1
    };
    this.api.post('Tmgreport/GetAlertVscTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertVscTat:', res);
        this.alertVscTat = res['data'];
        if(this.alertVscTat.length>0) this.handleChart2();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertNotAck() {
    this.alertNotAck = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetAlertNotAck', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertNotAck:', res);
        this.alertNotAck = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertNotCall(){
    this.alertNotCall = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertNotCall', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertNotCall:', res['data']);
        this.alertNotCall = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertVscPending(){
    this.alertVscPending = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertVscPending', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertVscPending:', res['data']);
        this.alertVscPending = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertOpen() {
    this.alertOpen = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetAlertOpen', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertOpen:', res);
        this.alertOpen = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertWorstCallTat() { 
    this.alertWorstCallTat = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertWorstCallTat', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertWorstCallTat:', res['data']);
        this.alertWorstCallTat = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getAlertVscWorst() { 
    this.alertVscWorst = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetAlertVscWorst', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('alertVscWorst:', res['data']);
        this.alertVscWorst = res['data'];
      }, err => {
        --this.common.loading;
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
}


