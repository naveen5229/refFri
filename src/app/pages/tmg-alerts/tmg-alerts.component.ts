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
  tripOnwardKmd = [];
  tripUnLoadindTime = [];
  tripLoadindTime = [];
  tripLongHalt = [];
  longestLoadindSites = [];
  longestUnLoadindDriver = [];
  tripSlowestOnward = [];
  longestUnLoadindSites = [];
  xAxisData = [];
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
    this.getTripOnwardKmd();
    this.getTripLoadindTime();
    this.getTripUnLoadindTime();
    this.getTripLongHalt();
    this.getLongestLoadindSites();
    this.getLongestUnLoadindSites();
    this.getTripSlowestOnward();
    this.getLongestUnLoadindDriver();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.xAxisData = [];
    this.getTripOnwardKmd();
    this.getTripLoadindTime();
    this.getTripUnLoadindTime();
    this.getTripLongHalt();
    this.getLongestLoadindSites();
    this.getLongestUnLoadindSites();
    this.getTripSlowestOnward();
    this.getLongestUnLoadindDriver();
  }

  getTripOnwardKmd() {
    this.tripOnwardKmd = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetTripOnwardKmd', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripOnwardKmd:', res);
        this.tripOnwardKmd = res['data'];
        this.handleChart();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTripLoadindTime() {
    this.tripLoadindTime = [];
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTripLoadindTime', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripLoadindTime:', res);
        this.tripLoadindTime = res['data'];
        if(this.tripLoadindTime.length>0) this.handleChart1();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTripUnLoadindTime() {
    this.tripUnLoadindTime = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7
    };
    this.api.post('Tmgreport/GetTripUnLoadindTime', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripUnLoadindTime:', res);
        this.tripUnLoadindTime = res['data'];
        if(this.tripUnLoadindTime.length>0) this.handleChart2();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTripLongHalt() {
    this.tripLongHalt = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTripLoadindHalt', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripLongHalt:', res);
        this.tripLongHalt = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getLongestLoadindSites(){
   
    this.longestLoadindSites = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetLongestLoadindSites', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('longestLoadindSites:', res['data']);
        this.longestLoadindSites = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getLongestUnLoadindSites() {
    this.longestUnLoadindSites = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetLongestUnLoadindSites', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('longestUnLoadindSites:', res);
        this.longestUnLoadindSites = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTripSlowestOnward(){
    this.tripSlowestOnward = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetTripSlowestOnward', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripSlowestOnward:', res['data']);
        this.tripSlowestOnward = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getLongestUnLoadindDriver() { 
    this.longestUnLoadindDriver = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetLongestUnLoadindDriver', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('longestUnLoadindDriver:', res['data']);
        this.longestUnLoadindDriver = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  handleChart(){
    let yaxis = [];
    let xaxis = [];
    this.tripLoadindTime.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Loading Duration(Min)']);
    });
    console.log("handleChart1",xaxis,yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in mins.)',
          data: yaxis,
          borderColor: 'blue',
          backgroundColor: 'blue',
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
        display:  true
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
      
    };
  }
 

  handleChart1(){
    let yaxis = [];
    let xaxis = [];
    this.tripLoadindTime.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Loading Duration(Min)']);
    });
    console.log("handleChart1",xaxis,yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in mins.)',
          data: yaxis,
          borderColor: 'blue',
          backgroundColor: 'blue',
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
        display:  true
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
      
    };
  }
  

  handleChart2(){
    let yaxis = [];
    let xaxis = [];
    this.tripUnLoadindTime.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Unloading Duration(Min)']);
    });
    console.log("handleChart2",xaxis,yaxis);
    this.chart2.type = 'line'
    this.chart2.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in mins)',
          data: yaxis,
          borderColor: 'blue',
          backgroundColor: 'blue',
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
      display:  true
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
    
  };
}
}


