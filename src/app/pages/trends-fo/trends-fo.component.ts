import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'trends-fo',
  templateUrl: './trends-fo.component.html',
  styleUrls: ['./trends-fo.component.scss']
})
export class TrendsFoComponent implements OnInit {
  highcharts = Highcharts;
  trendType = '11';
  period = "1";
  weekMonthNumber = "4";
  showPeriod = true;
  Details = [];
  halt = [];
  Hours = [];
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 6));
  chartObject = {
    type: 'bar',
    data: {

      labels: [],
      datasets: []
    },
    yaxisname: "Average Count",

    options: {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      maintainAspectRatio: false,
      title: {
        display: true,

      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
        {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,

          position: 'right',
          id: 'y-axis-2',

          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }]
      }
    },
  };
  count= null;
  chartObject1 = {
    type: 'line',
    data: {

      labels: [],
      datasets: []
    },
    yaxisname: "Average Count",

    options: {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      maintainAspectRatio: false,
      title: {
        display: true,

      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        }]
      }
    },
  };
  bgColor = '#00695C';
  yScale = '';
  yScale1 = '';

  xScale = '';
  dateDay = [];
  trendsVehicleData = [];
  onward = [];
  trendsVehicleSiteData = [];
  siteUnloading = [];
  constructor(public common: CommonService,
    public api: ApiService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    this.foTrendsData();
    this.getTrendsVehicle()
    this.getTrendsSite();

  }

  ngOnInit() {
  }
  setDataset(scale) {
    if (scale == 'dual') {
      this.chartObject.data = {
        labels: this.dateDay,
        datasets: [
          {
            type: 'line',
            label: 'Average Count',
            borderColor: 'blue',
            backgroundColor: 'blue',
            fill: false,
            data: this.Hours,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
            yAxisID: 'y-axis-1',
            yAxisName: 'Count',
          },
          {
            type: 'bar',
            label: 'Count',
            borderColor: 'pink',
            backgroundColor: 'pink',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
            fill: false,
            data: this.halt,
            yAxisID: 'y-axis-2'
          }
        ]
      };
    }
    else {
      this.chartObject1.data = {
        labels: this.dateDay,
        datasets: [
          {
            type: 'line',
            label: 'Onward Hours',
            borderColor: 'blue',
            backgroundColor: 'blue',
            fill: false,
            data: this.Hours,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
            yAxisID: 'y-axis-1',
            yAxisName: 'Count',
          }
        ]
      };
    }
    console.log("dataset", this.chartObject.data);
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
      this.xScale = 'Weeks of'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      this.xScale = 'Months of'
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
        this.Details = res['data'].result ;
        this.count = res['data'].veh_count ;

        
        console.log("detail-----------------------------------", this.Details)
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
    this.count=[];
    this.count=null;
    let params = {
      purpose: this.period,
      value: this.weekMonthNumber
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.Details = res['data'].result 
        this.count= res['data'].veh_count ;
        console.log("detail-----------------------------------", this.Details)
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
    console.log("detail-----------------------------------", this.Details)

    this.Hours = [];
    this.halt = [];
    let scale = this.trendType == '0' ? '' : 'dual';
    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        this.Hours.push(element.loading_hrs / element.loading_count);
        this.halt.push(element.loading_hrs)
        this.bgColor = '#00695C';
        this.yScale = 'Loading Hours';
        this.yScale1 = 'Loading Count'
        console.log('Hours: ', this.Hours);

      } else if (this.trendType == "21") {
        this.Hours.push(element.unloading_hrs / element.unloading_count);
        this.halt.push(element.unloading_hrs)
        this.bgColor = '#E91E63';
        this.yScale = 'UnLoading Hours';
        this.yScale1 = 'UnLoading Count'


      } else if (this.trendType == "0") {
        this.Hours.push(element.onward / this.count)
        this.halt.push();

        console.log("elementttt", element.onward)
        console.log("elementttt", this.Hours)

        this.bgColor = '#4CAF50';
        this.yScale = 'OnWard';
      }
    });
    this.showChart(scale);
  }

  showChart(scale) {
    this.setDataset(scale);
  }

  getTrendsVehicle() {
    this.trendsVehicleData = [];
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
      this.xScale = 'Weeks of'
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      this.xScale = 'Months of '
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }

    }
    console.log('params: ', params);
    this.common.loading++;

    this.api.post("Trends/getTrendsWrtVehicles", params).subscribe(res => {
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
      });
    },
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
