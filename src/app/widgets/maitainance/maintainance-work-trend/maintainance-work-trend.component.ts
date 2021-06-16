import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import * as _ from "lodash";


@Component({
  selector: 'maintainance-work-trend',
  templateUrl: './maintainance-work-trend.component.html',
  styleUrls: ['./maintainance-work-trend.component.scss']
})
export class MaintainanceWorkTrendComponent implements OnInit {
  challansMonthGraph = [];
  chart5 = {
    type: '',
    data: {},
    options: {},
  };

  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getChallansMonthGraph();
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

    getChallansMonthGraph() {
      this.challansMonthGraph = [];
     //  this.showLoader(index);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate)
      };
      this.api.post('Tmgreport/GetMaintainanceworktrend', params)
        .subscribe(res => {
          console.log('challansMonthGraph:', res);
          this.challansMonthGraph = res['data'];
         // this.hideLoader(index);
          this.handleChart5();
          
        }, err => {
         //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }
  
  
    handleChart5() {
      let yaxis = [];
      let xaxis = [];
      let executives = _.groupBy(this.challansMonthGraph, 'Month');
      let periods = _.groupBy(this.challansMonthGraph, 'flag');
      let newdatasets = Object.keys(periods)
        .map(period => {
          let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          yaxis.push(...periods[period].map(item => item['Count']))
          return {
            label: period,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            data: periods[period].map(item => item['Count']),
            linedata: periods[period].map(item => item['Amount']),
          }
        });
      console.log('DataSets:', newdatasets);
      console.log("handleChart5", xaxis, yaxis);
      this.chart5.type = 'bar';
      let oneresults = [ ...newdatasets[0].linedata, ...newdatasets[1].linedata];
      console.log('oneresults',oneresults);
      this.chart5.data = {
        labels: Object.keys(executives),
        "datasets": [
          { "data": newdatasets[0].data, "label": newdatasets[0].label,backgroundColor: "#7cbfe5", borderColor: "#7cbfe5",borderWidth: 1 },
          { "data": newdatasets[1].data, "label": newdatasets[1].label,backgroundColor: "#108361", borderColor: "#108361",borderWidth: 1 },
          { "data": oneresults, "label": "Cost", "type": "line" }
        ],
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
              labelString: 'Count Services' + chartobj.yaxisLabel
            },
            display: true,
            position: 'left',
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
              return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " thousand. )";
            }
          }
        },
      };
    }
  
    chart5Clicked(event) {
      console.log('chart 5 event is: ', event);
      console.log('passingDataInsideChart5Modal :', this.challansMonthGraph[event[0]._index]._adminusers_id);
      let xid = event[0]._datasetIndex + 1;
      //let xid = this.callsSupervisorUnLoadingTat[event[0]._index]._id;
      let isFoId = this.challansMonthGraph[event[0]._index]._adminusers_id;
      this.passingDataInsideChart5Modal(xid, isFoId);
    }
  
    passingDataInsideChart5Modal(id, isFoId) {
      let startDate = new Date(new Date().setDate(new Date().getDate() - 180));
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
      this.getDetials('Tmgreport/GetMaintainanceworktrend', params)
    }
}
