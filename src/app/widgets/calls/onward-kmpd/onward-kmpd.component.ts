import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import * as _ from "lodash";

@Component({
  selector: 'calls-onward-kmpd',
  templateUrl: './onward-kmpd.component.html',
  styleUrls: ['./onward-kmpd.component.scss']
})
export class OnwardKmpdComponent implements OnInit {
  callOnwardKmd =[];
  chart4 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getCallOnwardKmd();
    }
    getDetials(url, params, value = 0, type = 'days',flag) {
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
    getCallOnwardKmd() {
      this.callOnwardKmd = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 7,
        isfo: false,
        isadmin: true
      };
     // this.showLoader(index);
      this.api.post('Tmgreport/GetCallOnwardKmd', params)
        .subscribe(res => {
          console.log('callsSupervisorUnLoadingTat:', res);
          this.callOnwardKmd = res['data'] || [];
          if (this.callOnwardKmd.length > 0) this.handleChart4();
        //  this.hideLoader(index);
        }, err => {
         // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
    handleChart4() {
      let xaxis = [];
      let executives = _.groupBy(this.callOnwardKmd, 'Executive');
      let periods = _.groupBy(this.callOnwardKmd, 'Period');
      let yaxis = [];
      let datasets = Object.keys(periods)
        .map(period => {
          let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          yaxis.push(...periods[period].map(item => item['Onward KMs']))
          return {
            label: period,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            data: this.common.chartScaleLabelAndGrid(periods[period].map(item => item['Onward KMs'])).scaleData
          }
        });
  
      this.chart4.type = 'bar'
      this.chart4.data = {
        labels: Object.keys(executives),
        datasets
      };
      console.log('yaxis:', yaxis);
      let chartobj = this.common.chartScaleLabelAndGrid(yaxis);
  
      this.chart4.options = {
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
              labelString: 'KM' + chartobj.yaxisLabel
            },
            ticks: { stepSize: chartobj.gridSize },
            suggestedMin: chartobj.minValue
          }]
        },
      };
      console.log(' this.chart4:', this.chart4);
    }
  
    chart4Clicked(event) {
      console.log('chart 3 event is: ', event);
      let xid = event[0]._datasetIndex + 1;
      let isFoId = this.callOnwardKmd[event[0]._index]._adminusers_id;
      this.passingDataInsideChart4Modal(xid, isFoId);
    }
  
    passingDataInsideChart4Modal(id, isFoId) {
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 7,
        isadmin: true,
        isfo: isFoId,
        xid: id,
      };
      console.log('params :', params);
      this.getDetials('Tmgreport/GetCallOnwardKmd', params)
    }
}
