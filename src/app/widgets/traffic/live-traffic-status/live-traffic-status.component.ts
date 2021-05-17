import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'live-traffic-status',
  templateUrl: './live-traffic-status.component.html',
  styleUrls: ['./live-traffic-status.component.scss']
})
export class LiveTrafficStatusComponent implements OnInit {
  trafficLiveStatus=[];
  chart = {
    type: '',
    data: {},
    options: {},
    plugins: [],
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getTrafficLiveStatus();
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
    getTrafficLiveStatus() {
      this.trafficLiveStatus = [];
     // this.showLoader(index);
      let params = {
        totalrecord: 7
      };
      this.api.post('Tmgreport/GetTrafficLiveStatus', params)
        .subscribe(res => {
          console.log('trafficLiveStatus:', res);
          this.trafficLiveStatus = res['data'];
          this.handleChart(this.trafficLiveStatus);
        //  this.hideLoader(index);
        }, err => {
         // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
    handleChart(data) {
      let label = []
      let dt = [];
      if (data) {
        data.forEach(ele => {
          label.push(ele.split_part);
          dt.push(ele.totalvehicle);
        });
        console.log("label", label, "data", dt);
        this.chart.type = 'pie';
        this.chart.data = {
          labels: label,
          datasets: [
            {
              label: 'Zones',
              data: dt,
              backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#39CCCC", "#01FF70", "#8B008B", "#FFD700", "#D2B48C","#A569BD","#F0B27A","#CD6155","#2E86C1","#95A5A6","#45B39D"]
            },
          ]
        };
  
        this.chart.options = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: 'right',
            labels: {
              fontSize: dt.length > 8 ? 11 : 12,
              padding: dt.length > 8 ? 3 : 8,
              boxWidth: 10
            }
          },
          // tooltips: { enabled: false },
          // hover: {mode: null},
        };
  
      }
    }
    chart2Clicked(event) {

      let Date = this.trafficLiveStatus[event[0]._index].split_part;
      console.log('event[0]._index 2', event[0]._index, event[0], Date);
      this.passingIdChart2Data(Date);
    }
    passingIdChart2Data(parseDate) {
      //   this.showLoader(id);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        stepno:1,
        xid: parseDate
      };
      // this.api.post('Tmgreport/GetCallsDrivar', params)
      //   .subscribe(res => {
      //     console.log('callsDrivar 111 :', res);
  
      //     this.hideLoader(id);;
      //   }, err => {
      //     this.hideLoader(id);;
      //     console.log('Err:', err);
      //   });
      this.getDetials('Tmgreport/GetTrafficLiveStatus', params)
    }
}
