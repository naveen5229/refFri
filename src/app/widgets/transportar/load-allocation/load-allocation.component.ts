import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'load-allocation',
  templateUrl: './load-allocation.component.html',
  styleUrls: ['./load-allocation.component.scss']
})
export class LoadAllocationComponent implements OnInit {
  transportarLoadingTat =[];
  chart1 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getTransportarLoadingTat();
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

    getTransportarLoadingTat() {
      this.transportarLoadingTat = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 7
      };
     //  this.showLoader(index);
      this.api.post('Tmgreport/GetTransportarLoadingTat', params)
        .subscribe(res => {
          console.log('GetTransportarLoadingTat:', res);
          this.transportarLoadingTat = res['data'];
         // this.hideLoader(index);
          if (this.transportarLoadingTat.length > 0) this.handleChart1();
        }, err => {
          // this.hideLoader(index);
          console.log('Err:', err);
        });
    }

    handleChart1() {
      let yaxis = [];
      let xaxis = [];
      this.transportarLoadingTat.map(tlt => {
        xaxis.push(tlt['Period']);
        yaxis.push(tlt['tripcount']);
      });
      let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
      console.log("handleChart1", xaxis, yaxis);
      this.chart1.type = 'line'
      this.chart1.data = {
        labels: xaxis,
        datasets: [
          {
            label: 'Trip Count',
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
                labelString: 'Trip Count' + yaxisObj.yaxisLabel
              },
              ticks: { stepSize: yaxisObj.gridSize },
              suggestedMin: yaxisObj.minValue,
            }
            ]
          }
          // scales: {
          //   yAxes: [{
          //     ticks: { stepSize: 50000},
          //     suggestedMin : 0,
          //     max : 100
          //   }]
          //  },
  
        };
  
    }
    chart1Clicked(event) {
      console.log('event[0]._index 2', event[0],event[0]._index);
      let Date = this.transportarLoadingTat[event[0]._index]._id;
      console.log('event[0]._index 2', event[0]._index, event[0], Date);
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
        stepno:1
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
      this.getDetials('Tmgreport/GetTransportarLoadingTat', params)
    }
  
}
