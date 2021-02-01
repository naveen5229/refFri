import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

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
    this.getTrafficLiveStatus();
    this.getConsignmentLongestOnwardHalt();
    this.getConsignmentLongestGpsIssue();
    this.getConsignmentLongestLoading();
    this.getConsignmentLongestUnLoading();
    this.getLiveLongestParking();
    this.getConsignmentSlowestOnward();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.getTrafficLiveStatus();
    this.getConsignmentLongestOnwardHalt();
    this.getConsignmentLongestGpsIssue ();
    this.getConsignmentLongestLoading();
    this.getConsignmentLongestUnLoading();
    this.getConsignmentSlowestOnward();
    this.getLiveLongestParking();
  }

  getTrafficLiveStatus() {
    this.trafficLiveStatus = [];
    ++this.common.loading;
    let params = {
     totalrecord :7
    };
    this.api.post('Tmgreport/GetTrafficLiveStatus', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficLiveStatus:', res);
        this.trafficLiveStatus = res['data'];
        this.handleChart(this.trafficLiveStatus);
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getConsignmentLongestOnwardHalt() {
    this.consignmentLongestOnwardHalt = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord:6
    };
    this.api.post('Tmgreport/GetConsignmentLongestOnwardHalt', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('ConsignmentLongestOnwardHalt:', res);
        this.consignmentLongestOnwardHalt = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getConsignmentLongestGpsIssue () {
    this.consignmentLongestGpsIssue  = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 6
    };
    this.api.post('Tmgreport/GetConsignmentLongestGpsIssue', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficLongestVehicleGpsIssue:', res['data']);
        this.consignmentLongestGpsIssue = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

 

 getConsignmentLongestLoading() {
    this.consignmentLongestLoading = [];
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 3
    };
    ++this.common.loading;
    this.api.post('Tmgreport/GetConsignmentLongestLoading', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('ConsignmentLongestLoading:', res);
        this.consignmentLongestLoading = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getConsignmentLongestUnLoading() {
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
    ++this.common.loading;
    this.api.post('Tmgreport/GetConsignmentLongestUnLoading', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('ConsignmentLongestUnLoading:', res);
        this.consignmentLongestUnLoading = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getConsignmentSlowestOnward() { 
    this.consignmentSlowestOnward = [];
    ++this.common.loading;
    let startDate = new Date(new Date().setDate(new Date().getDate() - 15));
    let endDate = new Date();
    let params = {
      fromdate: this.common.dateFormatter(startDate),
      todate: this.common.dateFormatter(endDate),
      totalrecord : 3
    };
    this.api.post('Tmgreport/GetConsignmentSlowestOnward', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('ConsignmentSlowestOnward:', res['data']);
        this.consignmentSlowestOnward = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getLiveLongestParking() { 
    this.liveLongestParking = [];
    ++this.common.loading;
    let params = {
      totalrecord : 3
    };
    this.api.post('Tmgreport/GetLiveLongestParking', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('LiveLongestParking:', res['data']);
        this.liveLongestParking = res['data'];
      }, err => {
        --this.common.loading;
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
}