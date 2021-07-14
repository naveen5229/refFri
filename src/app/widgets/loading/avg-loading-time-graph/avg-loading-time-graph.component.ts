import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'avg-loading-time-graph',
  templateUrl: './avg-loading-time-graph.component.html',
  styleUrls: ['./avg-loading-time-graph.component.scss']
})
export class AvgLoadingTimeGraphComponent implements OnInit {
  loadingtat = []
  chart = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getLoadingtat();
    }
  getLoadingtat() {
    this.loadingtat = [];
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
    this.api.post('Tmgreport/GetTripLoadindTime', params)
      .subscribe(res => {
        console.log('GetLoadingtat:', res);
        this.loadingtat = res['data'];
        this.handleChart(params.fromdate, params.todate);
       this.hideLoader();
      }, err => {
this.hideLoader();
        console.log('Err:', err);
      });
  }
  handleChart(fromdate, todate) {
    let yaxis = [];
    let xaxis = [];
    let ids = [];
    this.loadingtat.map(tlt => {
      xaxis.push(tlt['Period']);
      yaxis.push(tlt['Loading Duration(hrs)']);
      ids.push(tlt['_id']);
    });
    let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
    console.log("handleChart", xaxis, yaxis);
    this.chart.type = 'bar'
    this.chart.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Avg hrs',
          data: yaxisObj.scaleData,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
      this.chart.options = {
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },
        scaleLabel: {
          display: true,
          labelString: 'Avg hrs' + yaxisObj.yaxisLabel,
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
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Avg hrs' + yaxisObj.yaxisLabel
            },
            ticks: { stepSize: yaxisObj.gridSize },
            suggestedMin: yaxisObj.minValue,
          },


          ]
        },
        onClick: (e, item) => {
          let idx = item[0]['_index'];
          // let xax = xaxis[idx];
          // let yax = yaxis[idx];
          let params = {
            stepno: 1,
            jsonparam: ids[idx],
            fromdate: fromdate,
            todate: todate,
            groupdays: 7
          }
          this.getDetials('Tmgreport/GetLoadingtat', params)

        }
        // scales: {
        //   yAxes: [{
        //     ticks: { stepSize: 50000},
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
  showLoader(index = 0) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("loading-1");
      let loader = document.createElement('div');
      loader.className = 'loader';
      console.log('show loader', index, outers[index]);
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index = 0) {
    try {
      let outers = document.getElementsByClassName("loading-1");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}
