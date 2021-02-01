import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tmg-traffic-analysis',
  templateUrl: './tmg-traffic-analysis.component.html',
  styleUrls: ['./tmg-traffic-analysis.component.scss']
})
export class TmgTrafficAnalysisComponent implements OnInit {
  trafficLiveStatus = [];
  consignmentLongestOnwardHalt = [];
  consignmentLongestGpsIssue = [];
  consignmentLongestLoading = [];
  consignmentLongestUnLoading = [];
  consignmentSlowestOnward = [];
  liveLongestParking = [];
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

  ngAfterViewInit() {
    this.refresh();
  }


  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getTrafficLiveStatus(0);
    this.getConsignmentLongestOnwardHalt(1);
    this.getConsignmentLongestGpsIssue (2);
    this.getConsignmentLongestLoading(3);
    this.getConsignmentLongestUnLoading(4);
    this.getConsignmentSlowestOnward(5);
    this.getLiveLongestParking(6);
  }

  getTrafficLiveStatus(index) {
    this.trafficLiveStatus = [];
     this.showLoader(index);
    let params = {
     totalrecord :7
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

  getConsignmentLongestOnwardHalt(index) {
    this.consignmentLongestOnwardHalt = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:6
    };
    this.api.post('Tmgreport/GetConsignmentLongestOnwardHalt', params)
      .subscribe(res => {
        console.log('ConsignmentLongestOnwardHalt:', res);
        this.consignmentLongestOnwardHalt = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getConsignmentLongestGpsIssue (index) {
    this.consignmentLongestGpsIssue  = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 6
    };
    this.api.post('Tmgreport/GetConsignmentLongestGpsIssue', params)
      .subscribe(res => {
        console.log('trafficLongestVehicleGpsIssue:', res['data']);
        this.consignmentLongestGpsIssue = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

 

 getConsignmentLongestLoading(index) {
    this.consignmentLongestLoading = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 3
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetConsignmentLongestLoading', params)
      .subscribe(res => {
        console.log('ConsignmentLongestLoading:', res);
        this.consignmentLongestLoading = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getConsignmentLongestUnLoading(index) {
    this.consignmentLongestUnLoading = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 3,
      stepno:0,
      jsonparam:null
     
    };
     this.showLoader(index);
    this.api.post('Tmgreport/GetConsignmentLongestUnLoading', params)
      .subscribe(res => {
        console.log('ConsignmentLongestUnLoading:', res);
        this.consignmentLongestUnLoading = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getConsignmentSlowestOnward(index) { 
    this.consignmentSlowestOnward = [];
     this.showLoader(index);
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 3
    };
    this.api.post('Tmgreport/GetConsignmentSlowestOnward', params)
      .subscribe(res => {
        console.log('ConsignmentSlowestOnward:', res['data']);
        this.consignmentSlowestOnward = res['data'];
        this.hideLoader(index);
      }, err => {
         this.hideLoader(index);
        console.log('Err:', err);
      });
  }

  getLiveLongestParking(index) { 
    this.liveLongestParking = [];
     this.showLoader(index);
    let params = {
      totalrecord : 3
    };
    this.api.post('Tmgreport/GetLiveLongestParking', params)
      .subscribe(res => {
        console.log('LiveLongestParking:', res['data']);
        this.liveLongestParking = res['data'];
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
      console.log("label",label,"data",dt);
      this.chart.type = 'pie';
      this.chart.data = {
        labels: label,
        datasets: [
          {
            label: 'Zones',
            data: dt,
            backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#39CCCC", "#01FF70", "#8B008B", "#FFD700", "#D2B48C"]
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
          fontSize : dt.length>8?11:12,
          padding : dt.length>8?3:8,
          boxWidth : 10
          }
        },
        // tooltips: { enabled: false },
        // hover: {mode: null},
      };

    }
  }

  getDetials(url, params, value = 0,type='days') {
    let dataparams = {
      view: {
        api: url,
        param: params,
        type: 'post'
      },
  
      title: 'Details'
    }
    if (value) {
      let startDate = type == 'months'? new Date(new Date().setMonth(new Date().getMonth() - value)): new Date(new Date().setDate(new Date().getDate() - value));
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
    let outers = document.getElementsByClassName("outer");
    outers[index].lastChild.remove();
  }
}