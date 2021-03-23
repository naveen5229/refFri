import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tmg-traffic',
  templateUrl: './tmg-traffic.component.html',
  styleUrls: ['./tmg-traffic.component.scss']
})
export class TmgTrafficComponent implements OnInit {
  trafficLiveStatus = [];
  trafficLongestDriverUnavailable = [];
  trafficLongestVehicleGpsIssue = [];
  trafficTopRmb = [];
  trafficLongestLoadingSites = [];
  trafficLongestUnloadingSite = [];
  trafficSlowestOnwardVehicles = [];
  trafficLongestVehicleEmpty = [];
  chart = {
    type: '',
    data: {},
    options: {},
    plugins: [],
  };

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refresh();
  }


  refresh() {
    this.getTrafficLiveStatus(0);
    this.getTrafficLongestDriverUnavailable(1);
    this.getTrafficLongestVehicleGpsIssue(2);
    this.getTrafficTopRmb(3);
    this.getTrafficLongestLoadingSites(4);
    this.getTrafficLongestUnloadingSite(5);
    this.getTrafficSlowestOnwardVehicles(6);
    this.getTrafficLongestVehicleEmpty(7);
  }

  getTrafficLiveStatus(index) {
    this.trafficLiveStatus = [];
    this.showLoader(index);
    let params = {
      totalrecord: 7
    };
    this.api.post('Tmgreport/GetTrafficLiveStatus', params)
      .subscribe(res => {
        console.log('trafficLiveStatus:', res);
        this.trafficLiveStatus = res['data'];
        this.handleChart(this.trafficLiveStatus);
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficLongestDriverUnavailable(index) {
    this.trafficLongestDriverUnavailable = [];
    this.showLoader(index);
    let params = { totalrecord: 5 };
    this.api.post('Tmgreport/GetTrafficLongestDriverUnavailable', params)
      .subscribe(res => {
        console.log('tripSlowestOnward:', res);
        this.trafficLongestDriverUnavailable = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficLongestVehicleGpsIssue(index) {
    this.trafficLongestVehicleGpsIssue = [];
    this.showLoader(index);
    let params = {
      totalrecord: 5
    };
    this.api.post('Tmgreport/GetTrafficLongestVehicleGpsIssue', params)
      .subscribe(res => {
        console.log('trafficLongestVehicleGpsIssue:', res['data']);
        this.trafficLongestVehicleGpsIssue = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficTopRmb(index) {
    this.trafficTopRmb = [];
    let params = { totalrecord: 10 };
    this.showLoader(index);
    this.api.post('Tmgreport/GetTrafficTopRmb', params)
      .subscribe(res => {
        console.log('trafficTopRmb:', res);
        this.trafficTopRmb = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficLongestLoadingSites(index) {
    this.trafficLongestLoadingSites = [];
    let params = { totalrecord: 3 };
    // this.showLoader(index);
    this.api.post('Tmgreport/GetTrafficLongestLoadingSites', params)
      .subscribe(res => {
        console.log('trafficLongestLoadingSites:', res);
        this.trafficLongestLoadingSites = res['data'];
        // this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficLongestUnloadingSite(index) {
    this.trafficLongestUnloadingSite = [];
    let params = { totalrecord: 3 };
    this.showLoader(index);
    this.api.post('Tmgreport/GetTrafficLongestUnloadingSite', params)
      .subscribe(res => {
        console.log('trafficLongestUnloadingSite:', res);
        this.trafficLongestUnloadingSite = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficSlowestOnwardVehicles(index) {
    this.trafficSlowestOnwardVehicles = [];
    this.showLoader(index);
    let params = {
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTrafficSlowestOnwardVehicles', params)
      .subscribe(res => {
        console.log('trafficSlowestOnwardVehicles:', res['data']);
        this.trafficSlowestOnwardVehicles = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getTrafficLongestVehicleEmpty(index) {
    this.trafficLongestVehicleEmpty = [];
    this.showLoader(index);
    let params = {
      totalrecord: 3
    };
    this.api.post('Tmgreport/GetTrafficLongestVehicleEmpty', params)
      .subscribe(res => {
        console.log('trafficLongestVehicleEmpty:', res['data']);
        this.trafficLongestVehicleEmpty = res['data'];
        this.hideLoader(index);
      }, err => {
        this.hideLoader(index);
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

  showLoader(index) {
    setTimeout(() => {
      let outers = document.getElementsByClassName("outer");
      let loader = document.createElement('div');
      loader.className = 'loader';
      outers[index].appendChild(loader);
    }, 50);
  }

  hideLoader(index) {
    try {
      let outers = document.getElementsByClassName("outer");
      let ele = outers[index].getElementsByClassName('loader')[0];
      outers[index].removeChild(ele);
    } catch (e) {
      console.log('Exception', e);
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
  chart4Clicked(event) {

    let Date = event._vid;
    console.log('event[0]._index 1', event);
    this.passingIdChart4Data(Date);
  }

  passingIdChart4Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3,
      stepno: 1,
      vehid: parseDate,
      // ref: 'tmg-calls'
    };
    this.getDetials('Tmgreport/GetTrafficLongestDriverUnavailable', params)
  }
  chart5Clicked(event) {

    let Date = event._vid;
    console.log('event[0]._index 1', event);
    this.passingIdChart5Data(Date);
  }

  passingIdChart5Data(parseDate) {
    //   this.showLoader(id);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord: 3,
      stepno: 1,
      vehid: parseDate,
      // ref: 'tmg-calls'
    };
    this.getDetials('Tmgreport/GetTrafficLongestVehicleGpsIssue', params)
  }
}


