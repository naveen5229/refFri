import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'avg-loading',
  templateUrl: './avg-loading.component.html',
  styleUrls: ['./avg-loading.component.scss']
})
export class AvgLoadingComponent implements OnInit {
  tripLoadindTime =[];
  chart1 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getTripLoadindTime();
    }
  getTripLoadindTime() {
    this.tripLoadindTime = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isfo: false,
      isadmin: true
    };
    this.showLoader();
    this.api.post('Tmgreport/GetTripLoadindTime', params)
      .subscribe(res => {
        console.log('tripLoadindTime:', res);
        this.tripLoadindTime = res['data'];
        if (this.tripLoadindTime.length > 0) this.handleChart1();
        this.hideLoader();;
      }, err => {
       this.hideLoader();
        console.log('Err:', err);
      });
  }
  handleChart1() {
    let yaxis = [];
    let xaxis = [];
    this.tripLoadindTime.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Loading Duration(hrs)']);
    });

    console.log('trip loading time : ', this.tripLoadindTime);
    console.log('y axis data:', yaxis);

    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart1", xaxis, yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Hrs.)',
          data: yaxisObj.scaleData,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
      this.chart1.options = {
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
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
              labelString: 'Time (in Hrs.)' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize },//beginAtZero: true,min:0,
            suggestedMin: yaxisObj.minValue,
          }
          ]
        },
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
              //   return tooltipItems.xLabel + " ( " + z + " Hrs. )";
              let z = (parseFloat((x % 1).toFixed(10)) * 0.6).toString();
              z = z.slice(0, z.indexOf('.') + 3).split('.').join(':') ;
                let final = x.toString().split('.')[0] +':'+ z.split(':')[1];
  
                return tooltipItems.xLabel + " ( " + final + " Hrs. )";
            }
          }
        },
        // scales: {
        //   yAxes: [{
        //     ticks: { stepSize: 50000},
        //     suggestedMin : 0,
        //     max : 100
        //   }]
        //  },

      };

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
  chart1Clicked(event) {

    let Date = this.tripLoadindTime[event[0]._index]._id;
    console.log('event[0]._index 1', event[0]._index, event[0], Date);
    this.passingIdChart1Data(Date);
  }

  passingIdChart1Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      groupdays: 7,
      isadmin: false,
      isfo: false,
      xid: parseDate,
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
    this.getDetials('Tmgreport/GetTripLoadindTime', params)
  }
  showLoader(index = 0) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("tripload-1");
      let loader = document.createElement('div');
      loader.className = 'loader';
      console.log('show loader', index, outers[index]);
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index = 0) {
    try {
      let outers = document.getElementsByClassName("tripload-1");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}
