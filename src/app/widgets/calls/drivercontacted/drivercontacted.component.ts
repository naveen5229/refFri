import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'drivercontacted',
  templateUrl: './drivercontacted.component.html',
  styleUrls: ['./drivercontacted.component.scss']
})
export class DrivercontactedComponent implements OnInit {
  callsDrivar =[];
  chart1 = {
    type: '',
    data: {},
    options: {},
  };

  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getCallsDrivar();
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
    getCallsDrivar() {
      this.callsDrivar = [];
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
      this.api.post('Tmgreport/GetCallsDriverDaywise', params)
        .subscribe(res => {
          console.log('callsDrivar:', res);
          this.callsDrivar = res['data'] || [];
          // this.driverIdArr = res['data'].map(element => {
          //     element = element._id;
          //   return element
          // });
         // console.log('driver array :', this.driverIdArr);
         this.hideLoader();;
  
          if (this.callsDrivar.length > 0) this.handleChart1();
        }, err => {
          this.hideLoader();
          console.log('Err:', err);
        });
    }
    handleChart1() {
      let yaxis = [];
      let xaxis = [];
      this.callsDrivar.map(tlt => {
        xaxis.push(this.common.changeDateformat(tlt['Date'], 'dd'));
        yaxis.push(tlt['Calls Percent']);
      });
      let yaxisObj = this.common.chartScaleLabelAndGrid(yaxis);
      console.log("handleChart1", xaxis, yaxis);
      this.chart1.type = 'line'
      this.chart1.data = {
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
                labelString: 'Call %' + yaxisObj.yaxisLabel
              },
              ticks: { stepSize: yaxisObj.gridSize },
              suggestedMin: yaxisObj.minValue,
            }]
          }
        };
    }

  
    chart1Clicked(event) {
  
      let Date = this.callsDrivar[event[0]._index].Date;
      console.log('event[0]._index', event[0]._index, event[0], Date);
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
        isadmin: true,
        isfo: false,
        date: parseDate,
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
      this.getDetials('Tmgreport/GetCallsDriverDaywise', params)
    }
  
    showLoader(index = 0) {
      setTimeout(() => {
        let outers = document.getElementsByClassName("callsload-3");
        let loader = document.createElement('div');
        loader.className = 'loader';
        console.log('show loader', index, outers[index]);
        outers[index].appendChild(loader);
      }, 50);
    }
  
    hideLoader(index = 0) {
      try {
        let outers = document.getElementsByClassName("callsload-3");
        let ele = outers[index].getElementsByClassName('loader')[0];
        outers[index].removeChild(ele);
      } catch (e) {
        console.log('Exception', e);
      }
    }
}
