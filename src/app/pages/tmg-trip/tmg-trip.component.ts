import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'tmg-trip',
  templateUrl: './tmg-trip.component.html',
  styleUrls: ['./tmg-trip.component.scss']
})
export class TmgTripComponent implements OnInit {
  tripOnwardKmd = [];
  tripUnLoadindTime = [];
  tripLoadindTime = [];
  tripLongHalt = [];
  longestLoadindSites = [];
  longestUnLoadindDriver = [];
  tripSlowestOnward = [];
  longestUnLoadindSites = [];
  tripGpsPerformance = [];
  xAxisData = [];

  // chart = {
  //   data: {
  //     line: [],
  //     bar: []
  //   },
  //   type: '',
  //   dataSet: {
  //     labels: [],
  //     datasets: []
  //   },
  //   yaxisname: null,
  //   options: null
  // };

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
    this.getTripSlowestOnward();
    this.getLongestUnLoadindDriver();
    this.getLongestUnLoadindSites();
    this.getTripGpsPerformance ();
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
    this.getTripSlowestOnward();
    this.getLongestUnLoadindDriver();
    this.getLongestUnLoadindSites();
    this.getTripGpsPerformance ();
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
        this.getlabelValue();
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

  getTripGpsPerformance(){ 
    this.tripGpsPerformance = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:3
    };
    this.api.post('Tmgreport/GetTripGpsPerformance', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripGpsPerformance:', res['data']);
        this.tripGpsPerformance = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }


  getlabelValue() {
    // if (this.tripOnwardKmd) {
    //   this.tripOnwardKmd.forEach((cmg) => {
    //     this.chart.data.line.push(cmg['Amount']);
    //     this.chart.data.bar.push(cmg['Onward KMS']);
    //     this.xAxisData.push(cmg['Period']);
    //   });

      this.handleChart();
    // }
  }

  // handleChart() {
  //   console.log("xAxis", this.chart.data.line,this.chart.data.bar,this.xAxisData);
  //   let data = {
  //     labels: this.xAxisData,
  //     datasets: []
  //   };
    
  //   data.datasets.push({
  //     type: 'line',
  //     label: 'Total(KMS)',
  //     borderColor: '#3d6fc9',
  //     backgroundColor: '#3d6fc9',
  //     pointHoverRadius: 8,
  //     pointHoverBackgroundColor: '#FFEB3B',
  //     fill: false,
  //     data: this.chart.data.line,
  //     yAxisID: 'y-axis-2'
  //   });

  //   data.datasets.push({
  //     type: 'bar',
  //     label: 'Onward (KMS)',
  //     borderColor: '#ed7d31',
  //     backgroundColor: '#ed7d31',
  //     fill: false,
  //     data: this.chart.data.bar.map(value => { return value.toFixed(2) }),
  //     pointHoverRadius: 8,
  //     pointHoverBackgroundColor: '#FFEB3B',
  //     yAxisID: 'y-axis-1',
  //     yAxisName: 'Count',
  //   });

  //   this.chart = {
  //     data: {
  //       line: [],
  //       bar: []
  //     },
  //     type: 'bar' ,
  //     dataSet: data,
  //     yaxisname: "Average Count",
  //     options: this.setChartOptions()
  //   };

  // }
  
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

  handleChart(){
    let yaxis = [];
    let xaxis = [];
    this.tripOnwardKmd.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Onward KMs']);
    });
    console.log("handleChart",xaxis,yaxis);
    this.chart.type = 'bar'
    this.chart.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Onward KMs',
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
        display:  true
      },
      scaleLabel: {
        display: true,
        labelString: 'Onward KMS',
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
      // scales: {
      //   yAxes: [{
      //     ticks: { stepSize: 50000},
      //   }]
      //  },
      
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
      // scales: {
      //   yAxes: [{
      //     ticks: { stepSize: 50000},
      //   }]
      //  },
      
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
