import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import * as _ from "lodash";

@Component({
  selector: 'avg-unloading-tat',
  templateUrl: './avg-unloading-tat.component.html',
  styleUrls: ['./avg-unloading-tat.component.scss']
})
export class AvgUnloadingTatComponent implements OnInit {
  callsSupervisorUnLoadingTat =[];
  chart5 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getCallsSupervisorUnLoadingTat();
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
    getCallsSupervisorUnLoadingTat() {
      this.callsSupervisorUnLoadingTat = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));;
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 15,
        isfo: false,
        isadmin: true
      };
     this.showLoader();
      this.api.post('Tmgreport/GetCallsSupervisorUnLoadingTat', params)
        .subscribe(res => {
          console.log('callsSupervisorUnLoadingTat:', res);
          this.callsSupervisorUnLoadingTat = res['data'] || [];
         this.hideLoader();
          if (this.callsSupervisorUnLoadingTat.length > 0) this.handleChart5();
        }, err => {
         this.hideLoader();
          console.log('Err:', err);
        });
    }
    handleChart5() {
      let yaxis = [];
      let xaxis = [];
      let executives = _.groupBy(this.callsSupervisorUnLoadingTat, 'Executive');
      let periods = _.groupBy(this.callsSupervisorUnLoadingTat, 'Period');
      let datasets = Object.keys(periods)
        .map(period => {
          let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          yaxis.push(...periods[period].map(item => item['TAT(Hrs)']))
          return {
            label: period,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            data: periods[period].map(item => item['TAT(Hrs)'])
          }
        });
      console.log('DataSets:', datasets);
      console.log("handleChart5", xaxis, yaxis);
      this.chart5.type = 'bar'
      this.chart5.data = {
        labels: Object.keys(executives),
        datasets
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
              labelString: 'TAT (in Hrs.)' + chartobj.yaxisLabel
            },
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
              return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
            }
          }
        },
      };
    }
  
    chart5Clicked(event) {
      console.log('chart 5 event is: ', event);
      console.log('passingDataInsideChart5Modal :', this.callsSupervisorUnLoadingTat[event[0]._index]._adminusers_id);
      let xid = event[0]._datasetIndex + 1;
      //let xid = this.callsSupervisorUnLoadingTat[event[0]._index]._id;
      let isFoId = this.callsSupervisorUnLoadingTat[event[0]._index]._adminusers_id;
      this.passingDataInsideChart5Modal(xid, isFoId);
    }
  
    passingDataInsideChart5Modal(id, isFoId) {
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 15,
        isadmin: true,
        isfo: isFoId,
        xid: id,
      };
      console.log('params :', params);
      this.getDetials('Tmgreport/GetCallsSupervisorUnLoadingTat', params)
    }
    showLoader(index = 0) {
      setTimeout(() => {
        let outers = document.getElementsByClassName("callsload-2");
        let loader = document.createElement('div');
        loader.className = 'loader';
        console.log('show loader', index, outers[index]);
        outers[index].appendChild(loader);
      }, 50);
    }
  
    hideLoader(index = 0) {
      try {
        let outers = document.getElementsByClassName("callsload-2");
        let ele = outers[index].getElementsByClassName('loader')[0];
        outers[index].removeChild(ele);
      } catch (e) {
        console.log('Exception', e);
      }
    }
}
