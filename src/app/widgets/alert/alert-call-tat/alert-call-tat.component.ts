import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'alert-call-tat',
  templateUrl: './alert-call-tat.component.html',
  styleUrls: ['./alert-call-tat.component.scss']
})
export class AlertCallTatComponent implements OnInit {
  alertCallTat =[];
  chart1 = {
    type: '',
    data: {},
    options: {},
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getAlertCallTat();
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
    getAlertCallTat() {
      this.alertCallTat = [];
      let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        groupdays: 1,
        stepno:0
      };
       //this.showLoader(index);
      this.api.post('Tmgreport/GetAlertCallTat', params)
        .subscribe(res => {
          console.log('alertCallTat:', res);
          this.alertCallTat = res['data'];
          if(this.alertCallTat.length>0) this.handleChart1();
         // this.hideLoader(index);
        }, err => {
         //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }
    
  handleChart1(){
    let yaxis = [];
    let xaxis = [];
    this.alertCallTat.map(tlt=>{
      xaxis.push(tlt['Period']);
      yaxis.push(((tlt['Call TAT(HH:MM)']) ? tlt['Call TAT(HH:MM)'] : 0));
    });
    console.log("handleChart1",xaxis,yaxis);
    this.chart1.type = 'line'
    this.chart1.data = {
      labels: xaxis,
      datasets: [
        {
          label: 'Time (in Mins.)',
          data: yaxis,
          borderColor: '#3d6fc9',
          backgroundColor: '#3d6fc9',
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B',
        },
      ]
    },
    this.chart1.options= {
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
            labelString: 'Time (in Mins.)'
          }
        }]
      } ,
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function (tooltipItems, data) {
            console.log("tooltipItems", tooltipItems, "data", data);
            // let tti = ('' + tooltipItems.yLabel).split(".");
            // let min = tti[1] ? String(parseInt(tti[1]) * 6).substring(0, 2) : '00';
            // return tooltipItems.xLabel + " ( " + tti[0] + ":" + min + " Hrs. )";
            let x = tooltipItems.yLabel;
            // let z = (parseFloat(x.toFixed()) + parseFloat((x % 1).toFixed(10)) * 0.6).toString();
            // z = z.slice(0, z.indexOf('.') + 3).split('.').join(':');

            let z = (parseFloat((x % 1).toFixed(10)) * 0.6).toString();
            z = z.slice(0, z.indexOf('.') + 3).split('.').join(':') ;
              let final = x.toString().split('.')[0] +':'+ z.split(':')[1];

              return tooltipItems.xLabel + " ( " + final + " Hrs. )";
          }
        }
      },
    };
  }
  chart2Clicked(event) {

    let Date = this.alertCallTat[event[0]._index].Date;
    console.log('event[0]._index', event[0]._index, event[0], Date);
    this.passingIdChart2Data(Date);
  }
  
  passingIdChart2Data(parseDate) {
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
    this.getDetials('Tmgreport/GetAlertCallTat', params)
  }
  
}
