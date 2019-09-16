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
  latLngSite=[];
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
    public modalService: NgbModal,
    public mapService: MapService,
    ) {
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

    this.common.loading++;
    this.api.post('Trends/getTrendsWrtFo', params)
      .subscribe(res => {
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
      11: ['Avg Loading Hours', 'Loading Count'],
      21: ['Avg Unloading Hours', 'Unloading Count'],
      31: ['Avg Onward Km', ''],
    };

    let yAxesLabel0 = yAxesLabels[this.trendType][0];
     let yAxeslegent= yAxesLabels[this.trendType][0]
    let yAxeslegent1= yAxesLabels[this.trendType][1]

    let yAxesLabel1 = yAxesLabels[this.trendType][1];
    let xAxesLabel = this.xAxesLabels[this.period];

    this.trends.forEach((trend) => {
      if (this.trendType == "11" || this.trendType == "21") {
        this.chart.data.line.push(this.trendType == "11" ? (trend.loading_hrs / trend.loading_count) : (trend.unloading_hrs / trend.unloading_count));
        this.chart.data.bar.push(this.trendType == "11" ? trend.loading_count : trend.unloading_count);
      } else if (this.trendType == "0") {
        let hrs = typeof trend.onward == 'number' ? trend.onward : parseFloat(trend.onward);
        this.chart.data.line.push(hrs);
      } else if (this.trendType == "31") {
        this.chart.data.line.push(trend.Onward_kmpd / this.vehicleCount)
      }
    });

    this.setDataset((this.trendType == '11' || this.trendType == '21') ? true : false, yAxesLabel0 , xAxesLabel, yAxesLabel1,yAxeslegent,yAxeslegent1);
  }
  getTick(data,steps,padPerX = 0.1,padPerY = 0.1){
    let getMinY = Infinity;
    let getMaxY = 0;
    let stepSize;
    let padX,padY;
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
      suggestedMax: (stepSize * steps) + getMinY ,
      stepSize : stepSize,
    };
  }
  setDataset(isDualChart, yAxesLabel0, xAxesLabel, yAxesLabel1?,yAxeslegent?,yAxeslegent1?) {

    let data = {
      labels: this.dateDay,
      datasets: []
    };

    data.datasets.push({
      type: 'line',
      label: isDualChart ?  yAxeslegent : '',
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
        display: this.trendType=="31"||this.trendType=="0"?false:true
      },
      tooltips:{
        mode:'index',
        intersect:'true'
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
      ticks: this.getTick(this.chart.data.line,5),
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
        ticks: this.getTick(this.chart.data.bar,5),
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
        this.common.loading++;

    this.api.post("Trends/getTrendsWrtVehicles", params).subscribe(res => {
      this.common.loading--;
      this.trendsVehicleData = res['data'] || [];
      this.trendsVehicleData.map(data => {
        data.loading_hrs = (data.loading_hrs) / (data.ldng_count);
        data.unloading_hrs = (data.unloading_hrs) / (data.unldng_count)
        data.total_halt=(data.total_halt)/(data.hlt_count)
      });
    }, err => {
      this.common.loading--;
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

    this.api.post("Trends/getTrendsWrtSite", params).subscribe(res => {
      this.common.loading--;
      this.trendsVehicleSiteData = res['data'] || [];
      this.trendsVehicleSiteData.map(data => {
        data.loading_hrs = (data.loading_hrs) / (data.ldng_count);
        data.unloading_hrs = (data.unloading_hrs) / (data.unldng_count)

      });
      this.loadingSite = res['data'].lodingArray
      this.siteUnloading = [];
      // this.latLngSite=res['data'].map(lat=>{
      //   console.log("latttt",lat)
      //   lat.latLngs

      // })
    
      // this.latLngSite=res['data']['latLngs'];
       console.log("laaaaaaaaaaaaaaaaaa",this.latLngSite)
      _.sortBy(this.trendsVehicleSiteData, ['unloading_hrs']).reverse().map(keyData => {
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

    console.log("laaaaaaaaasdf",latlng)
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
    this.common.params = { location, title: 'Location' ,fence: latlng.latLngs};
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
        temp.push(key, datas[key]);
        result.push(temp);
      });
    }
    else if (this.trendType == '21') {
      datas = dataTrend.unloadingArray;
      Object.keys(datas).map(key => {
        let temp = [];
        temp.push(key, datas[key]);
        result.push(temp);
      });
    }
    data = result;
    this.common.params = { title: 'SiteWise Vehicle List:', headings: ["Vehicle_RegNo.", "Count Event"], data };
    this.modalService.open(ViewListComponent, { size: 'sm', container: 'nb-layout' });
  }
}
