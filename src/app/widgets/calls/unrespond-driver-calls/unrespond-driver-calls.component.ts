import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'unrespond-driver-calls',
  templateUrl: './unrespond-driver-calls.component.html',
  styleUrls: ['./unrespond-driver-calls.component.scss']
})
export class UnrespondDriverCallsComponent implements OnInit {
  callsNotRespod =[];
  chart2 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getCallsNotRespod();
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
    getCallsNotRespod() {
      this.callsNotRespod = [];
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
      this.api.post('Tmgreport/GetCallsNotRespod', params)
        .subscribe(res => {
          console.log('tripUnLoadindTime:', res);
          this.callsNotRespod = res['data'] || [];
          if (this.callsNotRespod.length > 0) this.handleChart2();
        //  this.hideLoader(index);
        }, err => {
         // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
    handleChart2() {
      let yaxis = [];
      let xaxis = [];
      this.callsNotRespod.map(tlt => {
        xaxis.push(tlt['Period']);
        yaxis.push(tlt['percent']);
      });
      let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
      console.log("handleChart2", xaxis, yaxis);
      this.chart2.type = 'line'
      this.chart2.data = {
        labels: xaxis,
        datasets: [
          {
            label: 'Call %',
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
                labelString: 'Call %' + yaxisObj.yaxisLabel
              },
              ticks: { stepSize: yaxisObj.gridSize },
              suggestedMin: yaxisObj.minValue,
            }]
          }
        };
    }
    chart2Clicked(event) {
      let driverId = this.callsNotRespod[event[0]._index]._id;
      this.passingIdChart2Data(driverId);
    }
  
    passingIdChart2Data(id) {
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 7,
        isadmin: true,
        isfo: false,
        id: id,
        ref: 'Not-Responded-Calls'
      };
      console.log('params :', params);
      this.getDetials('Tmgreport/GetCallsNotRespod', params)
    }
  
}
