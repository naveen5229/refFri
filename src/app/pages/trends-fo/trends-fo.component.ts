import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'trends-fo',
  templateUrl: './trends-fo.component.html',
  styleUrls: ['./trends-fo.component.scss']
})
export class TrendsFoComponent implements OnInit {
  trendType = '11';
  period = "1";
  weekMonthNumber = "2";
  showPeriod = true;
  Details = [];
  Hours = [];
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 6));
  chartObject = {
    type: '',
    data: {},
    options: {},
    elements: {},
    lables: [],
    yAxes: [],
  };
  bgColor = '#00695C';
  yScale = '';
  xScale = '';
  dateDay = [];
  trendsVehicleData = [];
  onward = [];
  trendsVehicleSiteData = [];
  siteUnloading=[];
  constructor(public common: CommonService,
    public api: ApiService,
    public datepipe: DatePipe,
    public modalService:NgbModal) {
    this.foTrendsData();
    this.getTrendsVehicle()
    this.getTrendsSite();

  }

  ngOnInit() {
  }

  foTrendsData() {
    this.Details = [];
    this.dateDay = [];
    let params;
    if (this.period == '1') {
      this.xScale = 'Days'
      params = {
        startDate: this.common.dateFormatter(this.startDate),
        endDate: this.common.dateFormatter(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      this.xScale = 'Weeks'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      this.xScale = 'Months'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }

    }
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.Details = res['data'];
        this.Details.forEach((element) => {
          this.dateDay.push(this.datepipe.transform(element.date_day, 'dd-MMM'));
        });
        this.getCategoryDayMonthWeekWise();
      });
    err => {
      this.common.loading--;
      this.common.showError();
    }
  }


  getweeklyMothlyTrend() {
    this.dateDay = [];
    this.Details = [];
    let params = {
      purpose: this.period,
      value: this.weekMonthNumber
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.Details = res['data'];
        this.Details.forEach((element) => {
          this.dateDay.push(this.datepipe.transform(element.date_day, 'dd-MMM'));
        });
        this.getCategoryDayMonthWeekWise();
      });
    err => {
      this.common.loading--;
      this.common.showError();
    }
  }

  getCategoryDayMonthWeekWise() {
    if (this.trendType == '31') {
      this.showPeriod = false;
    } else {
      this.showPeriod = true;
    }
    this.Hours = [];
    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        this.Hours.push(element.loading_hrs);
        this.bgColor = '#00695C';
        this.yScale = 'Loading Hours';
        console.log('Hours: ', this.Hours);

      } else if (this.trendType == "21") {
        this.Hours.push(element.unloading_hrs);
        this.bgColor = '#E91E63';
        this.yScale = 'UnLoading Hours';

      } else if (this.trendType == "0") {
        this.Hours.push(element.onward)
        this.bgColor = '#4CAF50';
        this.yScale = 'OnWard Hours';
      }
    });
    this.showChart();
  }

  showChart() {
    this.chartObject.type = 'line';
    this.chartObject.data = {
      labels: this.dateDay,
      datasets: [
        {
          data: this.Hours,
          borderColor: this.bgColor,
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#FFEB3B'
        }
      ]
    };
    this.chartObject.options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      elements: {
        line: {
            tension: 0 // disables bezier curves
        }
    }
    };
  }

  getTrendsVehicle() {
    this.trendsVehicleData=[];
    this.dateDay = [];
    let params;
    if (this.period == '1') {
      this.xScale='Days'
      params = {
        startDate: this.common.dateFormatter(this.startDate),
        endDate: this.common.dateFormatter(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if(this.period=='2') {
      this.xScale='Weeks'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    }else {
      this.xScale='Months'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }

    }
    console.log('params: ', params);
    this.common.loading++;

    this.api.post("Trends/getTrendsWrtVehicles",params).subscribe(res => {
      this.common.loading--;
      this.trendsVehicleData = res['data'] || [];
    },
      err => {
        this.common.showError();
        console.log('Error: ', err);
      });
  }

  getTrendsSite() {
    this.Details = [];
    this.dateDay = [];
    this.trendsVehicleSiteData = []
    let params;
    if (this.period == '1') {
      this.xScale = 'Days'
      params = {
        startDate: this.common.dateFormatter(this.startDate),
        endDate: this.common.dateFormatter(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      this.xScale = 'Weeks'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      this.xScale = 'Months'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }

    }
    console.log('params: ', params);
    this.common.loading++;

    this.api.post("Trends/getTrendsWrtSite", params).subscribe(res => {
      this.common.loading--;
      this.trendsVehicleSiteData = res['data'] || [];
      this.siteUnloading = [];
      _.sortBy(this.trendsVehicleSiteData, ['unloading_hrs']).reverse().map(keyData => {
        console.log('keydata', keyData);
        this.siteUnloading.push(keyData);
    });},
      err => {
        this.common.showError();
        console.log('Error: ', err);
      });
  }

  locationOnMap(latlng) {
    if (!latlng.lat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: latlng.lat,
      lng: latlng.long,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }
}
