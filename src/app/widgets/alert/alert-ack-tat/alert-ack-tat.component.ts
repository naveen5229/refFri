import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'alert-ack-tat',
  templateUrl: './alert-ack-tat.component.html',
  styleUrls: ['./alert-ack-tat.component.scss']
})
export class AlertAckTatComponent implements OnInit {
  alertAckTat =[];
  chart = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getAlertAckTat();
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
    getAlertAckTat() {
      this.alertAckTat = [];
      // this.showLoader(index);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 1,
        stepno:0
      };
      this.api.post('Tmgreport/GetAlertAckTat', params)
        .subscribe(res => {
          console.log('alertAckTat:', res);
          this.alertAckTat = res['data'];
          if(this.alertAckTat.length>0) this.handleChart();
         // this.hideLoader(index);
        }, err => {
          // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
    handleChart(){
      let yaxis = [];
      let xaxis = [];
      this.alertAckTat.map(tlt=>{
        xaxis.push(tlt['Period']);
        yaxis.push(tlt['Ack TAT(Hrs)']);
      });
      console.log("handleChart",xaxis,yaxis);
      this.chart.type = 'line'
      this.chart.data = {
        labels: xaxis,
        datasets: [
          {
            label: 'Ack TAT(Hrs)',
            data: yaxis,
            borderColor: '#3d6fc9',
            backgroundColor: '#3d6fc9',
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
          },
        ]
      },
      this.chart.options= {
        responsive: true,
        legend: {
          position: 'bottom',
          display:  false
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
              labelString: 'Ack TAT (in Hrs.)'
            }
          }]
        } ,
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
    chart1Clicked(event) {

      let Date = this.alertAckTat[event[0]._index].Date;
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
        groupdays: 1,
        date: parseDate,
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
      this.getDetials('Tmgreport/GetAlertAckTat', params)
    }
}
