import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { LoginComponent } from '../login/login.component';
import { MapService } from '../../services/map.service';
import { slideToRight, slideToLeft } from '../../services/animation';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  dateDay = [];
  trendsVehicleData = [];
  onward = [];
  trendsVehicleSiteData = [];
  siteUnloading = [];
  graphString0 = 'Loading Hours';
  graphString1 = 'Loading Count';
  latLngSite = [];
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
    yaxisname: "Month",
    options: null
  };

  constructor(public common: CommonService,
    public api: ApiService,
    public datepipe: DatePipe,
    public modalService: NgbModal,
    public mapService: MapService,
  ) {
    this.common.refresh = this.refresh.bind(this);
    this.refresh();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getTrends();
    this.getTrendsVehicleSite();
    //this.getTrendsVehicle()
    // this.getTrendsSite();
  }

  getTrends() {
    let params = {
      startDate: this.period == '1' ? this.common.dateFormatter1(this.startDate) : '',
      endDate: this.period == '1' ? this.common.dateFormatter1(this.endDate) : '',
      purpose: this.period,
      value: this.weekMonthNumber,
    };

    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.trends = res['data'].result || [];
        if (this.trends.length == 0 || this.trends == null) {
          this.common.showError("Chart is not available");
        }
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
      11: ['Avg Loading Hours', 'Loading Count'],
      21: ['Avg Unloading Hours', 'Unloading Count'],
      31: ['Avg Onward Km', ''],
    };

    let yAxesLabel0 = yAxesLabels[this.trendType][0];
    let yAxeslegent = yAxesLabels[this.trendType][0]
    let yAxeslegent1 = yAxesLabels[this.trendType][1]
    
    let yAxesLabel1 = yAxesLabels[this.trendType][1];
    let xAxesLabel = this.xAxesLabels[this.period];

    let sortBy = this.trendType == "11" ? 'ldng_count' : this.trendType == "21" ? 'unldng_count' : 'onward';

    this.trendsVehicleSiteData = _.reverse(_.sortBy(this.trendsVehicleSiteData, [sortBy]));
    this.trendsVehicleData = _.reverse(_.sortBy(this.trendsVehicleData, [sortBy]));
    this.trends.forEach((trend) => {
      if (this.trendType == "11" || this.trendType == "21") {
        this.chart.data.line.push(this.trendType == "11" ? (trend.loading_hrs / trend.loading_count) || 0 : (trend.unloading_hrs / trend.unloading_count) || 0);
        this.chart.data.bar.push(this.trendType == "11" ? trend.loading_count : trend.unloading_count);
      } else if (this.trendType == "0") {
        let hrs = typeof trend.onward == 'number' ? trend.onward : parseFloat(trend.onward);
        this.chart.data.line.push(hrs);
      } else if (this.trendType == "31") {
        this.chart.data.line.push(trend.Onward_kmpd / this.vehicleCount)
      }
    });

    this.setDataset((this.trendType == '11' || this.trendType == '21') ? true : false, yAxesLabel0, xAxesLabel, yAxesLabel1, yAxeslegent, yAxeslegent1);
  }
  getTick(data, steps, padPerX = 0.1, padPerY = 0.1) {
    let getMinY = Infinity;
    let getMaxY = 0;
    let stepSize;
    let padX, padY;
    data.forEach(element => {
      getMinY = Math.min(element, getMinY);
      getMaxY = Math.max(element, getMaxY);
    });

    padX = (getMaxY - getMinY) * padPerX;
    padY = (getMaxY - getMinY) * padPerY;

    getMinY = getMinY - padY <= 0 ? 0 : getMinY - padY;
    getMaxY += padX;

    stepSize = Math.round((getMaxY - getMinY) / steps);

    return {
      suggestedMin: getMinY,
      suggestedMax: (stepSize * steps) + getMinY,
      stepSize: stepSize,
    };
  }
  setDataset(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1?, yAxeslegent?, yAxeslegent1?) {

    let data = {
      labels: this.dateDay,
      datasets: []
    };

    data.datasets.push({
      type: 'line',
      label: isDualChart ? yAxeslegent : '',
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
        label: yAxeslegent1,
        borderColor: '#c7eded',
        backgroundColor: '#c7eded',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FFEB3B',
        fill: false,
        data: this.chart.data.bar,
        yAxisID: 'y-axis-2'
      });
    };

    this.chart = {
      data: {
        line: [],
        bar: []
      },
      type: isDualChart ? 'bar' : 'line',
      dataSet: data,
      yaxisname: "Average Count",
      options: this.setChartOptions(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1)
    };

  }

  setChartOptions(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1?) {
    let options = {
      responsive: true,
      hoverMode: 'index',
      stacked: false,
      legend: {
        position: 'bottom',
        display: this.trendType == "31" || this.trendType == "0" ? false : true
      },
      tooltips: {
        mode: 'index',
        intersect: 'true'
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
      ticks: this.getTick(this.chart.data.line, 5),
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
        ticks: this.getTick(this.chart.data.bar, 5),
        scaleLabel: {
          display: true,
          labelString: yAxesLabel1,
          fontSize: 17,
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

  getTrendsVehicleSite() {
    this.trendsVehicleData = [];
    this.trendsVehicleSiteData = [];
    this.trends = [];
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
    this.common.loading++;

    this.api.post("Trends/getTrendsWrtVehiclesAndSites", params).subscribe(res => {
      this.common.loading--;
      this.trendsVehicleData = res['data']['vehData'] || [];
      if (this.trendsVehicleData.length == 0 || this.trendsVehicleData == null) {
        this.common.showError("Vehicle Data is not availabe")
      }
      console.log("--------------------", this.trendsVehicleData)
      this.trendsVehicleSiteData = res['data']['siteData'] || [];
      if (this.trendsVehicleSiteData.length == 0 || this.trendsVehicleSiteData == null) {
        this.common.showError("Site Data is not availabe")
      }
      this.loadingSite = res['data']['siteData'].lodingArray
      this.getTrendsVehicle();
      this.getTrendsSite();
    },
      err => {
        this.common.loading--;
        this.common.showError();
        console.log('Error: ', err);

      });
  }

  getTrendsVehicle() {
    this.trendsVehicleData.map(data => {
      data.loading_hrs = (data.loading_hrs) / (data.ldng_count);
      data.unloading_hrs = (data.unloading_hrs) / (data.unldng_count)
      if (data.total_halt != 0 || data.hlt_count != 0) {
        data.total_halt = (data.total_halt) / (data.hlt_count)
      }
      else {
        data.total_halt = 0;
        data.hlt_count = 0
      }
    });
    // let key = this.trendType == "11" ? "ldng_count" : (this.trendType == "21" ? "unldng_count" : "hlt_count");
    // this.trendsVehicleData.sort((e1,e2)=>{
    //   return e2[key] - e2[key];
    // })
    // console.log("keeeeeeeeeeeeeeeeeeyyyyyyyyyyyy",key)

  }

  getTrendsSite() {
    this.trendsVehicleSiteData.map(data => {
      data.loading_hrs = (data.loading_hrs) / (data.ldng_count);
      data.unloading_hrs = (data.unloading_hrs) / (data.unldng_count)
    });
    this.siteUnloading = [];
    _.sortBy(this.trendsVehicleSiteData, ['unloading_hrs']).reverse().map(keyData => {
      this.siteUnloading.push(keyData);
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
    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
        this.trends = res['data'].result || []
        this.vehicleCount = res['data'].veh_count;
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
      time: '',
    };
    this.common.params = { location, title: 'Location', fence: latlng.latLngs };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }

  getPendingStatus(dataTrend, type) {
    console.log("data", dataTrend);
    let headings = [];
    if (type === 'vehicle') {
      headings = ["RegNo.", "Count Event", "Avg Hrs."];
    }
    else {
      headings = ["Site", "Count Event", "Avg Hrs."];

    }
    let datas = [];
    let data = [];
    let result = [];
    if (this.trendType == '11') {

      datas = dataTrend.lodingArray;
      Object.keys(datas).map(key => {
        let temp = [];
        temp.push(key, datas[key].count, (datas[key].avgHours / datas[key].count).toFixed(2));
        result.push(temp);
      });
      result.sort((a, b) => {
        if (b[1] == a[1])
          return b[2] - a[2];
        else
          return b[1] - a[1];
      });
    }
    else if (this.trendType == '21') {
      datas = dataTrend.unloadingArray;
      Object.keys(datas).map(key => {
        let temp = [];
        temp.push(key, datas[key].count, (datas[key].avgHours / datas[key].count).toFixed(2));
        result.push(temp);
      });
      result.sort((a, b) => {
        if (b[1] == a[1])
          return b[2] - a[2];
        else
          return b[1] - a[1];
      });
    }
    data = result;
    let subTitle = dataTrend.sitename ? dataTrend.sitename : dataTrend.vehicle_id;
    this.common.params = { title: 'SiteWise Vehicle List :' + subTitle, headings: headings, data };
    this.modalService.open(ViewListComponent, { size: 'lg', container: 'nb-layout' });
  }
}
