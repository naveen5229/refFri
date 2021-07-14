import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'avg-unloading-time-slowest',
  templateUrl: './avg-unloading-time.component.html',
  styleUrls: ['./avg-unloading-time.component.scss']
})
export class AvgUnloadingTimeComponent implements OnInit {
  transportarSlowestOnward =[];
  transportarSlowestUnloadingtat = [];
  chart2 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getTransportarSlowestUnloadingtat();
   // this.getTransportarSlowestOnward();
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
    
    getTransportarSlowestOnward() {
      this.transportarSlowestOnward = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 60));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord: 3
      };
      // this.showLoader(index);
      this.api.post('Tmgreport/GetTransportarSlowestOnward', params)
        .subscribe(res => {
          console.log('transportarSlowestOnward:', res);
          this.transportarSlowestOnward = res['data'];
         // this.hideLoader(index);
        }, err => {
         //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }

    getTransportarSlowestUnloadingtat() {
    this.transportarSlowestUnloadingtat = [];
     this.showLoader();
     let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
     let endDate = new Date();
     let params = {
       fromdate: this.common.dateFormatter(startDate),
       todate: this.common.dateFormatter(endDate),
       groupdays: 7,
       isfo: false,
       isadmin: true
     };
     this.api.post('Tmgreport/GetTripUnLoadindTime', params)
      .subscribe(res => {
        console.log('transportarSlowestUnloadingtat:', res);
        this.transportarSlowestUnloadingtat = res['data'];
        if (this.transportarSlowestUnloadingtat.length > 0) this.handleChart2();
       this.hideLoader();
      }, err => {
         this.hideLoader();
        console.log('Err:', err);
      });
  }
  handleChart2() {
    let yaxis = [];
    let xaxis = [];
    this.transportarSlowestUnloadingtat.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Unloading Duration(hrs)']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart2", xaxis, yaxis);
    this.chart2.type = 'line'
    this.chart2.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Hrs)',
          data: yaxisObj.scaleData,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
      this.chart2.options = {
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
            ticks: { stepSize: yaxisObj.gridSize }, //beginAtZero: true,min:0,
            suggestedMin: yaxisObj.minValue,
          }]
        },
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

  chart3Clicked(event) {
    console.log('event[0]._index 2', event[0],event[0]._index);
    let Date = this.transportarSlowestUnloadingtat[event[0]._index]._id;
    console.log('event[0]._index 2', event[0]._index, event[0], Date);
    this.passingIdChart3Data(Date);
  }

  passingIdChart3Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      isadmin: false,
      isfo: false,
      xid: parseDate,
      stepno:1,
      totalrecord: 3
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
    this.getDetials('Tmgreport/GetTransportarSlowestUnloadingtat', params)
  }
  showLoader(index = 0) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("transportar-1");
      let loader = document.createElement('div');
      loader.className = 'loader';
      console.log('show loader', index, outers[index]);
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index = 0) {
    try {
      let outers = document.getElementsByClassName("transportar-1");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}

