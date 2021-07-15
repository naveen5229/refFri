import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'avg-uloading-time',
  templateUrl: './avg-uloading-time.component.html',
  styleUrls: ['./avg-uloading-time.component.scss']
})
export class AvgUloadingTimeComponent implements OnInit {
  unloadingtat = [];
  
  chart = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getUnloadingtat();

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
    getUnloadingtat() {
      this.unloadingtat = [];
      //this.showLoader(index);
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
          console.log('getUnloadingtat:', res);
          this.unloadingtat = res['data'];
          this.getlabelValue(params.fromdate, params.todate);
         //this.hideLoader(index);
        }, err => {
         // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
  
    getlabelValue(fromdate, todate) {
  
      this.handleChart(fromdate, todate);
    }
    handleChart(fromdate, todate) {
      let yaxis = [];
      let xaxis = [];
      let ids = [];
      this.unloadingtat.map(tlt => {
        xaxis.push(tlt['Period']);
        yaxis.push(tlt['Unloading Duration(hrs)']);
        ids.push(tlt['_id']);
      });
      if (!yaxis.length) return;
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
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
              label: function (tooltipItems, data) {
                console.log("tooltipItems", tooltipItems, "data", data);
                let tti = ('' + tooltipItems.yLabel).split(".");
                let min = tti[1] ? parseInt(tti[1]) * 6 : '00';
                return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
              }
            }
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
            this.getDetials('Tmgreport/GetUnLoadingtat', params)
  
          }
          // scales: {
          //   yAxes: [{
          //     ticks: { stepSize: 50000},
          //   }]
          //  },
  
        };
  
  
    }
  
}
