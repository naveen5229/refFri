import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    this.getTrafficLiveStatus();
    this.getTrafficLongestDriverUnavailable();
    this.getTrafficLongestVehicleGpsIssue();
    this.getTrafficTopRmb();
    this.getTrafficLongestLoadingSites();
    this.getTrafficLongestUnloadingSite();
    this.getTrafficLongestVehicleEmpty();
    this.getTrafficSlowestOnwardVehicles();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.getTrafficLiveStatus();
    this.getTrafficLongestDriverUnavailable();
    this.getTrafficLongestVehicleGpsIssue ();
    this.getTrafficTopRmb();
    this.getTrafficLongestLoadingSites();
    this.getTrafficLongestUnloadingSite();
    this.getTrafficSlowestOnwardVehicles();
    this.getTrafficLongestVehicleEmpty();
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

  getTrafficLongestDriverUnavailable() {
    this.trafficLongestDriverUnavailable = [];
    ++this.common.loading;
    let params = { totalrecord: 5 };
    this.api.post('Tmgreport/GetTrafficLongestDriverUnavailable', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('tripSlowestOnward:', res);
        this.trafficLongestDriverUnavailable = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTrafficLongestVehicleGpsIssue () {
    this.trafficLongestVehicleGpsIssue  = [];
    ++this.common.loading;
    let params = {
      totalrecord : 5
    };
    this.api.post('Tmgreport/GetTrafficLongestVehicleGpsIssue', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficLongestVehicleGpsIssue:', res['data']);
        this.trafficLongestVehicleGpsIssue = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTrafficTopRmb() {
    this.trafficTopRmb = [];
    let params = { totalrecord: 10 };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTrafficTopRmb', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficTopRmb:', res);
        this.trafficTopRmb = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

 getTrafficLongestLoadingSites() {
    this.trafficLongestLoadingSites = [];
    let params = { totalrecord: 3 };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTrafficLongestLoadingSites', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficLongestLoadingSites:', res);
        this.trafficLongestLoadingSites = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTrafficLongestUnloadingSite() {
    this.trafficLongestUnloadingSite = [];
    let params = { totalrecord: 3 };
    ++this.common.loading;
    this.api.post('Tmgreport/GetTrafficLongestUnloadingSite', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficLongestUnloadingSite:', res);
        this.trafficLongestUnloadingSite = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTrafficSlowestOnwardVehicles() { 
    this.trafficSlowestOnwardVehicles = [];
    ++this.common.loading;
    let params = {
      totalrecord : 3
    };
    this.api.post('Tmgreport/GetTrafficSlowestOnwardVehicles', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficSlowestOnwardVehicles:', res['data']);
        this.trafficSlowestOnwardVehicles = res['data'];
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getTrafficLongestVehicleEmpty() { 
    this.trafficLongestVehicleEmpty = [];
    ++this.common.loading;
    let params = {
      totalrecord : 3
    };
    this.api.post('Tmgreport/GetTrafficLongestVehicleEmpty', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('trafficLongestVehicleEmpty:', res['data']);
        this.trafficLongestVehicleEmpty = res['data'];
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
          position: 'right'

        },
        // tooltips: { enabled: false },
        // hover: {mode: null},
      };

    }
  }
}


