import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewListComponent } from '../../modals/view-list/view-list.component';

@Component({
  selector: 'trends-fo',
  templateUrl: './trends-fo.component.html',
  styleUrls: ['./trends-fo.component.scss']
})
export class TrendsFoComponent implements OnInit {
  scale = ''
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
      display: true,

      legend: {
        position: 'bottom',
        display: true,
      },

      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: ' ',
            fontSize: 17

          },
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
        {
          scaleLabel: {
            display: true,
            labelString: '',
            fontSize: 17

          },
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,

          position: 'right',
          id: 'y-axis-2',

          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }]
        , xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '',
            fontSize: 17

          },
        }],
      }
    },
  };
  loadingSite = []
  count = null;
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
      legend: { position: 'bottom' },

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
          scaleLabel: {
            display: true,
            labelString: '',
            fontSize: 17

          },
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '',
            fontSize: 17

          },
        }],
      }
    },
  };
  bgColor = '#00695C';
  yScale = '';
  yScale1 = '';

  //xScale = '';
  dateDay = [];
  trendsVehicleData = [];
  onward = [];
  trendsVehicleSiteData = [];
  siteUnloading = [];
  graphString0 = 'Loading Hours';
  graphString1 = 'Loading Count';
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

  foTrendsData() {
    this.Details = [];
    this.dateDay = [];
    this.count = null;
    let params;
    if (this.period == '1') {
      // this.xScale = 'Days'
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Days of';

      params = {
        startDate: this.common.dateFormatter1(this.startDate),
        endDate: this.common.dateFormatter1(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      //this.xScale = 'Weeks of'
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Weeks of';

      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      //this.xScale = 'Months of'
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Month of';

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
        this.Details = res['data'].result || [];
        this.count = res['data'].veh_count;
        console.log("detail-----------------------------------", this.Details)
        this.Details.forEach((element) => {
          this.dateDay.push(this.datepipe.transform(element.date_day, 'dd-MMM'));
        });
        this.getCategoryDayMonthWeekWise();

      },
        err => {
          this.common.loading--;
          this.common.showError();
        });
  }


  getweeklyMothlyTrend() {
    this.dateDay = [];
    this.Details = [];
    this.count = null;
    let params = {
      purpose: this.period,
      value: this.weekMonthNumber
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.Details = res['data'].result || []
        this.count = res['data'].veh_count;
        console.log("detail-----------------------------------", this.Details)
        this.Details.forEach((element) => {
          this.dateDay.push(this.datepipe.transform(element.date_day, 'dd-MMM'));
        });
        this.getCategoryDayMonthWeekWise();
      },
        err => {
          this.common.loading--;
          this.common.showError();
        });
  }

  getCategoryDayMonthWeekWise(type?) {
    this.chartObject.data = null;
    //this.chartObject1.data = null;

    this.chartObject.options.scales.yAxes[0].scaleLabel.labelString = '';
    this.chartObject.options.scales.yAxes[1].scaleLabel.labelString = '';
    this.chartObject1.options.scales.yAxes[0].scaleLabel.labelString = '';
    if (type) {
      this.trendType = type;
    }

    this.Hours = [];
    this.halt = [];
    this.scale = this.trendType == '0' || this.trendType == '31' ? '' : 'dual';
    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        this.chartObject.options.scales.yAxes[0].scaleLabel.labelString = 'Loading Hours';
        this.chartObject.options.scales.yAxes[1].scaleLabel.labelString = 'Loading Count';
        this.Hours.push(element.loading_hrs / element.loading_count);
        this.halt.push(element.loading_count).toFixed(2);
        this.bgColor = '#00695C';
      } else if (this.trendType == "21") {
        this.chartObject.options.scales.yAxes[0].scaleLabel.labelString = 'Unloading Hours';
        this.chartObject.options.scales.yAxes[1].scaleLabel.labelString = 'Unloading Count';
        this.Hours.push(element.unloading_hrs / element.unloading_count);
        this.halt.push(element.unloading_count);
        this.bgColor = '#E91E63';

      } else if (this.trendType == "0") {
        this.chartObject1.options.scales.yAxes[0].scaleLabel.labelString = 'Onward Percentage';

        let hrs = typeof element.onward == 'number' ? element.onward : parseInt(element.onward);
        this.Hours.push(hrs);
        this.bgColor = '#4CAF50';
      }
      else if (this.trendType == "31") {
        this.chartObject1.options.scales.yAxes[0].scaleLabel.labelString = 'Onward',
          this.Hours.push(element.Onward_kmpd / this.count)
        this.bgColor = '#4CAF50';
      }
    });
    setTimeout(() => {
      // console.log(JSON.stringify(this.chartObject1.data));
      console.log('__________TT__________');
      this.setDataset(this.scale);
    }, 100);
  }

  getTrendsVehicle() {
    this.trendsVehicleData = [];
    this.dateDay = [];
    let params;
    if (this.period == '1') {
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Days of';

      params = {
        startDate: this.common.dateFormatter1(this.startDate),
        endDate: this.common.dateFormatter1(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Weeks of';

      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Month  of';

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
      this.trendsVehicleData.map(data => {
        console.log("dataaaaaaaaaaaaaaaaaa", data)
        data.loading_hrs = (data.loading_hrs) / (data.ldng_count);
        data.unloading_hrs = (data.unloading_hrs) / (data.unldng_count)

      });
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
      //this.xScale = 'Days of'
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Days of';

      params = {
        startDate: this.common.dateFormatter1(this.startDate),
        endDate: this.common.dateFormatter1(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      // this.xScale = 'Weeks of'
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Weeks of';

      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      // this.xScale = 'Months of'
      this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Month  of';

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
      this.trendsVehicleSiteData.map(data => {
        console.log("dataaaaaaaaaaaaaaaaaa", data)
        data.loading_hrs = (data.loading_hrs) / (data.ldng_count);
        data.unloading_hrs = (data.unloading_hrs) / (data.unldng_count)

      });
      this.loadingSite = res['data'].lodingArray
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

  getPendingStatus(dataTrend) {
    let datas = [];
    let data = [];
    let result = [];
    if (this.trendType == '11') {

      datas = dataTrend.lodingArray;
      Object.keys(datas).map(key => {
        let temp = [];
        console.log("key", key);
        temp.push(key, datas[key]);
        result.push(temp);
      });
    }
    else if (this.trendType == '21') {
      console.log("result", result);
      datas = dataTrend.unloadingArray;
      Object.keys(datas).map(key => {
        let temp = [];
        console.log("key", key);
        temp.push(key, datas[key]);
        result.push(temp);
      });
    }
    data = result;

    console.log(data);
    this.common.params = { title: 'SiteWise Vehicle List:', headings: ["Vehicle_RegNo.", "Count Event"], data };
    this.modalService.open(ViewListComponent, { size: 'sm', container: 'nb-layout' });

  }

  setDataset(scale) {
    console.log('_________________________', this.Hours);
    if (scale === 'dual') {
      console.log("if")
      let getMinY1 = Infinity;
      let getMaxY1 = 0;
      let pad = 10;
      let steps = 5;
      this.Hours.forEach(element => {
        getMinY1 = Math.min(element, getMinY1);
        getMaxY1 = Math.max(element, getMaxY1);
      });
      getMinY1 = getMinY1 - pad <= 0 ? 0 : getMinY1 - pad;
      getMaxY1 += pad;
      this.chartObject.options.scales.yAxes[0]['ticks'] = {
        min: getMinY1,
        max: getMaxY1,
        stepSize: (getMaxY1 - getMinY1) / steps,
      };
      let getMinY2 = Infinity;
      let getMaxY2 = 0;
      let pad2 = 20;
      let steps2 = 5;
      this.halt.forEach(element => {
        getMinY2 = Math.min(element, getMinY2);
        getMaxY2 = Math.max(element, getMaxY2);
      });
      getMinY2 = getMinY2 - pad2 <= 0 ? 0 : getMinY2 - pad2;
      getMaxY2 += pad2;
      this.chartObject.options.scales.yAxes[1]['ticks'] = {
        min: getMinY2,
        max: getMaxY2,
        stepSize: (getMaxY2 - getMinY2) / steps2,
      };
      this.chartObject.data = {
        labels: this.dateDay,
        datasets: [
          {
            type: 'line',
            label: 'Average Count',
            borderColor: '#0a7070',
            backgroundColor: '#0a7070',
            fill: false,
            data: this.Hours.map(hrs => { return hrs.toFixed(2) }),
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
            yAxisID: 'y-axis-1',
            yAxisName: 'Count',
          },
          {
            type: 'bar',
            label: 'Count',
            borderColor: '#c7eded',
            backgroundColor: '#c7eded',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
            fill: false,
            data: this.halt,
            yAxisID: 'y-axis-2'
          }
        ]
      };
    } else {
      // let getMinY1 = Infinity;
      // let getMaxY1 = 0;
      // let pad = 10;
      // let steps = 5;
      // this.Hours.forEach(element => {
      //   getMinY1 = Math.min(element, getMinY1);
      //   getMaxY1 = Math.max(element, getMaxY1);
      // });
      // getMinY1 = getMinY1 - pad <= 0 ? 0 : getMinY1 - pad;
      // getMaxY1 += pad;
      // this.chartObject1.options.scales.yAxes[0]['ticks'] = {
      //   min: getMinY1,
      //   max: getMaxY1,
      //   stepSize: (getMaxY1 - getMinY1) / steps,
      // };
      this.chartObject1.data = {
        labels: this.dateDay,
        datasets: [
          {
            type: 'line',
            label: 'Onward',
            borderColor: 'blue',
            backgroundColor: 'blue',
            fill: false,
            data: this.Hours.map(hrs => { return hrs.toFixed(2) }),
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B',
            yAxisID: 'y-axis-1',
            yAxisName: 'Count',
          }
        ]
      };
      console.log("dataset", this.chartObject1.data);
      console.log("dataset", this.chartObject1.data.datasets);
    }
  }

}
