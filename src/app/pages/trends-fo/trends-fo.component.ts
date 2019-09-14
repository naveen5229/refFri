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
  trends = [];

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 6));
  loadingSite = []
  vehicleCount = 0;

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

  xAxesLabels = {
    1: 'Days of',
    2: 'Weeks of',
    3: 'Month of'
  };

  chart = {
    data: {
      line: [],
      bar: []
    },
    type: '',
    dataSet: {
      labels: [],
      datasets: []
    },
    yaxisname: "Average Count",
    options: null
  };

  constructor(public common: CommonService,
    public api: ApiService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    this.initialize();
  }

  ngOnInit() {
  }

  initialize() {
    this.getTrends();
    this.getTrendsVehicle()
    this.getTrendsSite();
  }

  getTrends() {
    let params = {
      startDate: this.period == '1' ? this.common.dateFormatter1(this.startDate) : '',
      endDate: this.period == '1' ? this.common.dateFormatter1(this.endDate) : '',
      purpose: this.period,
      value: this.weekMonthNumber,
    };
    console.log('params: ', params);

    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.trends = res['data'].result || [];
        this.vehicleCount = res['data'].veh_count;
        this.dateDay = this.trends.map(trend => {
          return this.datepipe.transform(trend.date_day, 'dd-MMM');
        });

        this.getCategoryDayMonthWeekWise();
      }, err => {
        this.common.loading--;
        console.log('Api Error:', err);
        this.common.showError();
      });
  }

  getCategoryDayMonthWeekWise(type?) {

    if (type) this.trendType = type;
    this.chart.data.line = [];
    this.chart.data.bar = [];

    let yAxesLabels = {
      0: ['Onward Percentage', ''],
      11: ['Loading Hours', 'Loading Count'],
      21: ['Unloading Hours', 'Unloading Count'],
      31: ['Onward', ''],
    };

    let yAxesLabel0 = yAxesLabels[this.trendType][0];
    let yAxesLabel1 = yAxesLabels[this.trendType][1];
    let xAxesLabel = this.xAxesLabels[this.period];

    this.trends.forEach((trend) => {
      if (this.trendType == "11" || this.trendType == "21") {
        this.chart.data.line.push(trend.loading_hrs / trend.loading_count);
        this.chart.data.bar.push(trend.loading_count).toFixed(2);
      } else if (this.trendType == "0") {
        let hrs = typeof trend.onward == 'number' ? trend.onward : parseInt(trend.onward);
        this.chart.data.line.push(hrs);
      } else if (this.trendType == "31") {
        this.chart.data.line.push(trend.Onward_kmpd / this.vehicleCount)
      }
    });

    this.setDataset((this.trendType == '11' || this.trendType == '21') ? true : false, yAxesLabel0, xAxesLabel, yAxesLabel1);
  }

  setDataset(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1?) {
      let tick1,tick2;
      let getMinY1 = Infinity;
      let getMaxY1 = 0;
      let pad = 10;
      let steps = 5;
      this.chart.data.line.forEach(element => {
        getMinY1 = Math.min(element, getMinY1);
        getMaxY1 = Math.max(element, getMaxY1);
      });
      
      getMinY1 = getMinY1 - pad <= 0 ? 0 : getMinY1 - pad;
      getMaxY1 += pad;
      
      tick1 = {
        min: getMinY1,
        max: getMaxY1,
        stepSize: (getMaxY1 - getMinY1) / steps,
      };

    let data = {
      labels: this.dateDay,
      datasets: []
    };

    data.datasets.push({
      type: 'line',
      label: isDualChart ? 'Average Count' : 'Onward',
      borderColor: isDualChart ? '#0a7070' : 'blue',
      backgroundColor: isDualChart ? '#0a7070' : 'blue',
      fill: false,
      data: this.chart.data.line.map(value => { return value.toFixed(2) }),
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#FFEB3B',
      yAxisID: 'y-axis-1',
      yAxisName: 'Count',
    });

    if (isDualChart) {
      data.datasets.push({
        type: 'bar',
        label: 'Count',
        borderColor: '#c7eded',
        backgroundColor: '#c7eded',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FFEB3B',
        fill: false,
        data: this.chart.data.bar,
        yAxisID: 'y-axis-2'
      });
      let getMinY2 = Infinity;
      let getMaxY2 = 0;
      let pad2 = 20;
      let steps2 = 5;
      this.chart.data.bar.forEach(element => {
        getMinY2 = Math.min(element, getMinY2);
        getMaxY2 = Math.max(element, getMaxY2);
      });
      getMinY2 = getMinY2 - pad2 <= 0 ? 0 : getMinY2 - pad2;
      getMaxY2 += pad2;
      tick2 = {
        min: getMinY2,
        max: getMaxY2,
        stepSize: (getMaxY2 - getMinY2) / steps2,
      };
    };

    this.chart = {
      data: {
        line: [],
        bar: []
      },
      type: isDualChart ? 'bar' : 'line',
      dataSet: data,
      yaxisname: "Average Count",
      options: this.setChartOptions(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1,tick1,tick2)
    };
  }

  setChartOptions(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1?,tick1?,tick2?) {
    let options = {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      legend: isDualChart ? {
        position: 'bottom',
        display: true,
      } : { position: 'bottom' },
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
        yAxes: [],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: xAxesLabel,
            fontSize: 17
          },
        }],
      }
    }

    options.scales.yAxes.push({
      ticks : tick1,
      scaleLabel: {
        display: true,
        labelString: yAxesLabel0,
        fontSize: 17
      },
      type: 'linear',
      display: true,
      position: 'left',
      id: 'y-axis-1',

    });

    if (isDualChart) {
      options.scales.yAxes.push({
        ticks : tick2,
        scaleLabel: {
          display: true,
          labelString: yAxesLabel1,
          fontSize: 17
        },
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          drawOnChartArea: false,
        },
      });
    };
    return options;

  }

  getTrendsVehicle() {
    this.trendsVehicleData = [];
    this.dateDay = [];
    let params;
    if (this.period == '1') {
      params = {
        startDate: this.common.dateFormatter1(this.startDate),
        endDate: this.common.dateFormatter1(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
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
    }, err => {
      this.common.showError();
      console.log('Error: ', err);
    });
  }

  getTrendsSite() {
    this.trends = [];
    this.dateDay = [];
    this.trendsVehicleSiteData = []
    let params;
    if (this.period == '1') {
      //this.xScale = 'Days of'
      // this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Days of';

      params = {
        startDate: this.common.dateFormatter1(this.startDate),
        endDate: this.common.dateFormatter1(this.endDate),
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else if (this.period == '2') {
      // this.xScale = 'Weeks of'
      // this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Weeks of';

      params = {
        purpose: this.period,
        value: this.weekMonthNumber,
      }
    } else {
      // this.xScale = 'Months of'
      // this.chartObject.options.scales.xAxes[0].scaleLabel.labelString = 'Month  of';

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

    }, err => {
      this.common.showError();
      console.log('Error: ', err);
    });
  }

  getweeklyMothlyTrend() {
    this.dateDay = [];
    this.trends = [];
    this.vehicleCount = null;
    let params = {
      purpose: this.period,
      value: this.weekMonthNumber
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.trends = res['data'].result || []
        this.vehicleCount = res['data'].veh_count;
        console.log("detail-----------------------------------", this.trends)
        this.trends.forEach((trend) => {
          this.dateDay.push(this.datepipe.transform(trend.date_day, 'dd-MMM'));
        });
        this.getCategoryDayMonthWeekWise();
      },
        err => {
          this.common.loading--;
          this.common.showError();
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
}
