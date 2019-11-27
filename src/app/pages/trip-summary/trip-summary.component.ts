import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import * as _ from 'lodash';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';


@Component({
  selector: 'trip-summary',
  templateUrl: './trip-summary.component.html',
  styleUrls: ['./trip-summary.component.scss']
})
export class TripSummaryComponent implements OnInit {

  Hours = [];
  dateDay = [];
  startDate = new Date();
  endDate = new Date();
  lastTrend = '';
  showtrend = false;  //new 
  showTables = false;
  Details = [];
  siteDetails = [];
  vehicleDetails = [];
  showdate: any;
  kmpdDate = []; //new change
  showPeriod = true;  //new changes
  dateStr = [];
  trendType = '11';
  siteUnloading = [];
  vehicleUnloading = [];
  onWardDistance = [];
  week_month_number = "4";
  period = "0";
  url = '';
  flag = 'Loading';
  bgColor = '#00695C';
  yScale = 'Hours';
  onWardFlag = false;
  fromDate = '';
  vehicleTrips=[];
  // lastCategory='';
  headings = [];
  valobj = {};
  lastDurationCategory = '';
  element = {}; //new changes
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  chartObject = {
    type: '',
    data: {},
    options: {},
    elements: {},
    lables: [],
    yAxes: [],
    ticks: {},
    min: '',
    max: '',
    stepSize: ''

  };


  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    this.getDefaultTrend();
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnInit() { }
  refresh() {

    this.getDefaultTrend();
  }

  getDefaultTrend() {

    let today, endDay, startday;
    today = new Date();
    endDay = new Date(today.setDate(today.getDate() - 1))
    this.endDate = this.common.dateFormatter(endDay);
    console.log('enddate for default', this.endDate);
    //this.endDate=this.common.dateFormatter(new Date())
    if (this.period == "0") {
      startday = new Date(today.setDate(today.getDate() - 6));
      this.fromDate = this.common.dateFormatter(startday);
      console.log('endDate', this.endDate);
      console.log('startDate', startday, this.fromDate);
      console.log('zero period call');
      this.getDayWiseTrends();
    }
    else if (this.period == "1") {
      //  this.week_number='7'
      // startday = new Date(today.setWeek(today.getWeek() - 4));
      this.startDate = this.common.dateFormatter(startday);
      console.log('endDate', this.endDate);
      console.log('startDate', startday, this.startDate);
      this.getweeklyTrend();
    }
    else if (this.period == '2') {
      //  this.month_number='7';
      // startday = new Date(today.setMonth(today.getMonth() - 4));
      this.startDate = this.common.dateFormatter(startday);
      // this.startDate=(this.common.dateFormatter(startday)).split('')[0];
      console.log('endDate', this.endDate);
      console.log('startDate', startday, this.startDate);
      this.getMonthlyTrends();

    } else {
      startday = new Date(today.setDate(today.getDate() - 6));
      this.fromDate = this.common.dateFormatter(startday);
    }

  }


  showChart() {
    console.log('dateday:showChart', this.dateDay);
    console.log('kmpd:showChart', this.dateDay);
    console.log('Hours:showChart', this.Hours);
    this.chartObject.type = 'line';

    if (this.trendType == '31') {
      this.chartObject.data = {

        // labels: this.dateDay ? this.dateDay : this.kmpdDate,
        labels: this.kmpdDate,
        datasets: [
          {
            //  label: this.flag,
            data: this.Hours,
            borderColor: this.bgColor,
            // backgroundColor: this.bgColor, //new
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B'
          }
        ]
      };
      this.chartObject.options = {
        responsive: true,
        maintainAspectRatio: false,
        elements: this.element,
        legend: {
          display: false
        },

        yAxes: [{
          ticks: {
            min: 100,
            max: 500,
            stepSize: 100
          }
        }]

      };
    } else {
      this.chartObject.data = {

        // labels: this.dateDay ? this.dateDay : this.kmpdDate,
        labels: this.dateDay,
        datasets: [
          {
            //  label: this.flag,
            data: this.Hours,
            borderColor: this.bgColor,
            // backgroundColor: this.bgColor, //new
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#FFEB3B'
          }
        ]
      };
      this.chartObject.options = {
        responsive: true,
        maintainAspectRatio: false,
        // elements: this.element ? this.element : null,
        legend: {
          display: false
        },

        yAxes: [{
          ticks: {
            min: 100,
            max: 500,
            stepSize: 100
          }
        }]

      };
    }

    console.log('lable', this.chartObject.lables);
  }

  getSiteWise() {

    let params = {
      startDate: this.common.dateFormatter(this.fromDate).split(' ')[0],
      endDate: this.common.dateFormatter(this.endDate).split(' ')[0] + ' ' + '23:59:59'
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsSiteWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.siteDetails = res['data'];
        console.log('siteDetails: ', this.siteDetails);
        this.siteUnloading = [];
        _.sortBy(this.siteDetails, ['unloading_hrs']).reverse().map(keyData => {
          console.log('keydata', keyData);
          this.siteUnloading.push(keyData);
          //console.log('siteUnloading: ',  this.siteUnloading);
        });

      },
        err => {
          this.common.loading--;
          this.common.showError();

        })

  }

  getVehicleWise() {
    let params = {
      startDate: this.common.dateFormatter(this.fromDate).split(' ')[0],
      endDate: this.common.dateFormatter(this.endDate).split(' ')[0] + ' ' + '23:59:59'
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsVehicleWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleDetails = res['data'];
        console.log('vehicleDetails: ', this.vehicleDetails);
        this.vehicleUnloading = [];
        _.sortBy(this.vehicleDetails, ['unloading_hrs']).reverse().map(keyData => {
          this.vehicleUnloading.push(keyData);
        });

        // console.log('vehicleUnloading: ',  this.vehicleUnloading);

      },
        err => {
          this.common.loading--;
          this.common.showError();

        })
  }

  changeTrendType(flag?) {

    if (flag == 'week_month') {
      if (this.period == '1') {
        this.getweeklyTrend();
      } else if (this.period == '2') {
        this.getMonthlyTrends();
      }
    } else if (this.trendType == '31') {
      this.showTables = false;
      this.showPeriod = false;
      this.getOnwardDistance();
    } else {
      if (this.period == "0") {
        this.showPeriod = true;
        if (this.lastDurationCategory == 'DayWise') {
          if (this.lastTrend == 'kmpd') {  //for onward-kmpd handling
            this.getDayWiseTrends();
          } else
            this.getCategoryDayWise();
        }
        else {
          this.getDayWiseTrends();
        }
      } else if (this.period == "1") {
        this.showPeriod = true;
        this.showTables = false;
        if (this.lastDurationCategory == 'WeekWise') {
          this.getCategoryWeekWise();
        }
        else {
          this.getweeklyTrend();
        }

      } else {
        this.showPeriod = true;
        this.showTables = false;
        if (this.lastDurationCategory == 'MonthWise') {
          this.getCategoryMonthWise();
        } else {
          this.getMonthlyTrends();
        }
      }
    }

    this.lastTrend = this.trendType;

  }

  getDate(type) {

    this.common.params = { ref_page: 'trends' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.fromDate = '';
          this.fromDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('fromDate', this.fromDate);
        }
        else {
          this.endDate = new Date();
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });


  }

  // changePeriod(){
  //   if(this.period=="0"){
  //     this.getDayWiseTrends();
  //   }else if(this.period=="1"){
  //     this.getweeklyTrend();
  //   }else{
  //     this.getMonthlyTrends();
  //   }
  // }

  getDayWiseTrends() {
    //this.element = null;
    this.lastTrend = '';
    this.Details = [];
    console.log('getDayWiseTrends call');
    this.dateDay = [];
    //this.element = '';
    this.fromDate = this.common.dateFormatter(this.fromDate).split(' ')[0]
    // this.fromDate=(this.common.dateFormatter(this.fromDate)).split('')[0];
    this.endDate = this.common.dateFormatter(this.endDate).split(' ')[0];
    let params = {
      startDate: this.fromDate,
      endDate: this.endDate + ' ' + '23:59:59'
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsDayWise', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.Details = res['data'];
        this.Details.forEach((element) => {
          this.showdate = this.datepipe.transform(element.date_day, 'dd-MMM');
          this.dateDay.push(this.showdate);
          console.log('dateDay: ', this.showdate);
        });
        this.getCategoryDayWise();
      }, err => {
        this.common.loading--;
        this.common.showError();

      })
    this.getSiteWise();
    this.getVehicleWise();

  }

  getCategoryDayWise() {

    this.Hours = [];
    //this.element = '';
    this.lastDurationCategory = 'DayWise';
    console.log('changeTrendType:', 'call');
    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        //this.lastCategory='Loading';
        this.Hours.push(element.loading_hrs);
        this.showTables = true;
        this.flag = "Loading"
        this.bgColor = '#00695C';
        this.yScale = 'Hours'
        this.onWardFlag = false;
        console.log('Hours: ', this.Hours);

      } else if (this.trendType == "21") {
        // this.lastCategory='UnLoading';
        this.Hours.push(element.unloading_hrs);
        this.showTables = true;
        this.flag = "UnLoading";
        this.bgColor = '#E91E63';
        this.yScale = 'Hours'
        this.onWardFlag = false;
        // this.showChart();
      } else if (this.trendType == "0") {
        // this.lastCategory='onWard';
        this.Hours.push(element.onward);
        this.showTables = true;
        this.flag = "onWard";
        this.bgColor = '#4CAF50';
        this.yScale = 'percent'
        this.onWardFlag = true;
        // this.showChart();

      }


    });
    this.showChart();

  }

  getweeklyTrend() {


    let today, startday;
    this.dateStr = [];
    // this.dateDay = [];
    this.Details = [];
    today = new Date();
    //endDay=new Date(today.setDate(today.getDate()-1))
    this.endDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1))).split(' ')[0];
    let number = parseInt(this.week_month_number);
    console.log('converted number', number);
    startday = new Date(today.setDate(today.getDate() - number * 7));
    // startday=new Date(today.setWeek(today.getWeek() - number));
    this.startDate = this.common.dateFormatter(startday.setDate(startday.getDate() + 1)).split(' ')[0];
    console.log('startDate:weekly', this.startDate);
    let params = {
      startDate: this.startDate,
      endDate: this.endDate + ' ' + '23:59:59'
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWeekWise', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res:weekWise', res['data']);
        this.Details = res['data'];
        this.Details.forEach((element) => {
          this.dateStr.push(element.date_day);
        });
        this.getCategoryWeekWise();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
    // if(this.week_month_number=="4"){
    // startday=new Date(today.setWeek(today.getWeek()-4));
    // this.startDate=this.common.dateFormatter(startday);   
    // }else if(this.week_month_number=="5"){
    //   startday=new Date(today.setWeek(today.getWeek()-5));
    // }else if(this.week_month_number=="6"){
    //   startday=new Date(today.setWeek(today.getWeek()-4));
    // }else if(this.week_month_number=="7"){
    //   startday=new Date(today.setWeek(today.getWeek()-4));
    // }

  }

  getCategoryWeekWise() {

    let str: any;
    // this.element = '';
    this.dateDay = [];
    this.Hours = [];
    this.lastDurationCategory = 'WeekWise';
    let number = parseInt(this.week_month_number);
    console.log('datestr length', this.dateStr.length);
    for (let i = 0; i < this.dateStr.length; i++) {
      str = this.datepipe.transform(this.dateStr[i], 'dd-MMM') + ' - ';
      if (this.dateStr[i + 1]) {
        let z = new Date(this.dateStr[i + 1]);
        str += this.datepipe.transform(this.common.dateFormatter(new Date(z.setDate(z.getDate()) - 1)), 'dd-MMM');
        this.dateDay.push(str);
      } else {

        if (i + 1 == this.dateStr.length) {
          str += this.datepipe.transform(this.endDate, 'dd-MMM');
          this.dateDay.push(str);
        } else {
          str += this.datepipe.transform(this.dateStr[i], 'dd-MMM');
          this.dateDay.push(str);
        }

      }

    }

    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        //this.lastCategory='Loading';
        this.Hours.push(element.loading_hrs);
        this.flag = "Loading"
        this.bgColor = '#00695C';
        this.yScale = 'Hours'

      } else if (this.trendType == "21") {
        //this.lastCategory='UnLoading';
        this.Hours.push(element.unloading_hrs);
        this.flag = "UnLoading";
        this.bgColor = '#E91E63';
        this.yScale = 'Hours'
        // this.showChart();
      } else if (this.trendType == "0") {
        //this.lastCategory='onWard';
        this.Hours.push(element.onward);
        this.flag = "onWard"
        this.bgColor = '#4CAF50';
        this.yScale = 'percent'
        // this.showChart();

      }


    });

    this.showChart();

  }

  getMonthlyTrends() {
    this.showTables = false;
    this.Details = [];
    this.dateStr = [];
    let today, startday;
    today = new Date();
    //endDay=new Date(today.setDate(today.getDate()-1))
    // this.endDate = this.common.dateFormatter(today).split(' ')[0];
    this.endDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1))).split(' ')[0];
    let number = parseInt(this.week_month_number);
    console.log('converted number', number);
    startday = new Date(today.setMonth(today.getMonth() - number));
    // this.startDate = this.common.dateFormatter(startday).split(' ')[0];
    this.startDate = this.common.dateFormatter(startday.setDate(startday.getDate() + 1)).split(' ')[0];
    console.log('startDate:monthly', this.startDate);
    let params = {
      startDate: this.startDate,
      endDate: this.endDate + ' ' + '23:59:59'
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsMonthWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.Details = res['data'];
        console.log('res:monthWise', res['data']);
        this.Details.forEach((element) => {
          this.dateStr.push(element.date_day);
        });
        this.getCategoryMonthWise();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })


  }

  getCategoryMonthWise() {
    let str: any;
    //this.element = ' ';
    this.dateDay = [];
    this.Hours = [];
    this.lastDurationCategory = 'MonthWise';
    let number = parseInt(this.week_month_number);
    for (let i = 0; i < this.dateStr.length; i++) {
      str = this.datepipe.transform(this.dateStr[i], 'dd-MMM') + ' - ';
      if (this.dateStr[i + 1]) {
        let z = new Date(this.dateStr[i + 1]);
        str += this.datepipe.transform(this.common.dateFormatter(new Date(z.setDate(z.getDate()) - 1)), 'dd-MMM');
        this.dateDay.push(str);
      } else {

        if (i + 1 == this.dateStr.length) {
          str += this.datepipe.transform(this.endDate, 'dd-MMM');
          this.dateDay.push(str);
        } else {
          str += this.datepipe.transform(this.dateStr[i], 'dd-MMM');
          this.dateDay.push(str);
        }

      }

    }
    console.log('dateDay:month ', this.dateDay);
    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        //this.lastCategory='Loading';
        this.Hours.push(element.loading_hrs);
        this.flag = "Loading"
        this.bgColor = '#00695C';
        this.yScale = 'Hours'
        console.log('loading case:', 'call');

      } else if (this.trendType == "21") {
        //this.lastCategory='UnLoading';
        this.Hours.push(element.unloading_hrs);
        this.flag = "UnLoading"
        this.bgColor = '#E91E63';
        this.yScale = 'Hours'
        // this.showChart();
      } else if (this.trendType == "0") {
        // this.lastCategory='onWard';
        this.Hours.push(element.onward);
        this.flag = "onWard"
        this.bgColor = '#4CAF50';
        this.yScale = 'percent'
        // this.showChart();

      }
    });
    this.showChart();

  }


  getPendingStatusDetails(details) {
    let params = {
      siteId: details.siteid,
      startDate: this.fromDate,
      endDate: this.endDate + ' ' + '23:59:59'
    };
    this.common.loading++;
    this.api.post('Trends/getSiteWiseVehicleList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        let data = [];
        res['data'].map((vehicles, index) => {
          if (this.trendType == '11') {
            if (vehicles.halttypid == 11)
              data.push([vehicles.regno, vehicles.countevent]);
          } else {
            if (vehicles.halttypid == 21)
              data.push([vehicles.regno, vehicles.countevent]);
          }
        });
        console.log(data);
        this.common.params = { title: 'SiteWise Vehicle List:', headings: ["Vehicle_RegNo.", "Count Event"], data };
        this.modalService.open(ViewListComponent, { size: 'sm', container: 'nb-layout' });
      }, err => {
        this.common.loading--;
        console.log(err);
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

  getOnwardDistance() {
    let params = this.newMethod();
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getGroupOnwardDistance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.onWardDistance = res['data'];
        // this.period = null;
        this.showTables = false;
        this.showPeriod = false;
        this.onWardDistance.forEach((element) => {
          this.showdate = this.datepipe.transform(element.DATE, 'dd-MMM');
          this.kmpdDate.push(this.showdate);
          this.Hours.push(element.KMPD);
          console.log('dateDay , Hours: ', this.kmpdDate, this.Hours);
          this.yScale = "KMPD"

        });
        this.element = {
          line: {
            tension: 0 // disables bezier curves
          }
        },
          this.bgColor = '#A0522D';
        this.showChart();

      }, err => {
        this.common.loading--;
        this.common.showError();

      })


  }
  private newMethod() {
    this.onWardDistance = [];
    this.kmpdDate = [];
    // this.dateDay = [];
    this.Hours = [];
    this.endDate = this.common.dateFormatter(this.endDate).split(' ')[0];
    this.fromDate = this.common.dateFormatter(this.fromDate).split(' ')[0];
    let params = {
      startDate: this.fromDate,
      endDate: this.endDate + ' ' + '23:59:59'
    };
    return params;
  }

// getTripSummary(){
//  // let params = this.newMethod();
//  const params = {
//   startDate: this.startDate,
//   endDate: this.endDate,
// }; 
//  console.log('params: ', params);
//   this.common.loading++;
//   this.api.post('TripExpenseVoucher/getRouteTripSummary', params)
//     .subscribe(res => {
//       this.common.loading--;
//       console.log('res: ', res['data']);
//       this.onWardDistance = res['data'];
//       // this.period = null;
//       this.showTables = false;
//       this.showPeriod = false;
//       this.onWardDistance.forEach((element) => {
//         this.showdate = this.datepipe.transform(element.DATE, 'dd-MMM');
//         this.kmpdDate.push(this.showdate);
//         this.Hours.push(element.KMPD);
//         console.log('dateDay , Hours: ', this.kmpdDate, this.Hours);
//         this.yScale = "KMPD"

//       });
//       this.element = {
//         line: {
//           tension: 0 // disables bezier curves
//         }
//       },
//         this.bgColor = '#A0522D';
//       this.showChart();

//     }, err => {
//       this.common.loading--;
//       this.common.showError();

//     })

// }
  // getTrend() {   //new change for onward-kmpd
  //   if (this.trendType == '31') {
  //     this.lastTrend = 'kmpd'
  //     this.getOnwardDistance();
  //   } else {
  //     this.getDayWiseTrends();
  //   }

  // }


  getTripSummary() {
    this.vehicleTrips = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    let startDate = this.common.dateFormatter(this.fromDate);
    let endDate = this.common.dateFormatter(this.endDate);
    console.log('start & end', startDate, endDate);
    const params = {
      startDate: startDate,
      endDate: endDate,
    }; 
    console.log('params', params);
    this.common.loading++;
    this.api.post('TripExpenseVoucher/getRouteTripSummary', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        // this.vehicleId = -1;
        // this.vehicleTrips = res['data'];
        //this.vehicleTrips = JSON.parse(res['data']);
        this.vehicleTrips = res['data'];
        //this.table = this.setTable();
        if (this.vehicleTrips != null) {
          console.log('vehicleTrips', this.vehicleTrips);
          let first_rec = this.vehicleTrips[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {

            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }

          }
          let action = { title: 'Action', placeholder: 'Action' };
         // this.table.data.headings['action'] = action;


          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }
  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.vehicleTrips.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {


        // if (this.headings[j] == "Kpi") {
        //  columns.push( this.valobj[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.vehicleTrips[i]), isHTML: true, class: 'black' };

        // }

        if (this.headings[j] == "Trip") {
          this.valobj[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.vehicleTrips[i]), isHTML: true, class: 'black' };

        } else {
          this.valobj[this.headings[j]] = { value: this.vehicleTrips[i][this.headings[j]], class: 'black', action: '' };
        }

        this.valobj['action'] = {
          value: '', isHTML: true, action: null, icons: [
            // { class: 'fa fa-pencil-square-o  edit-btn', isHTML: `<h2>test</h2>`, action:  this.viewRouteTimeTable.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-question-circle report-btn', action: this.reportIssue.bind(this, this.vehicleTrips[i]) },
            // { class: " fa fa-trash remove", action: this.deleteTrip.bind(this, this.vehicleTrips[i]) },
            // { class: " fa fa-route route-mapper", action: this.openRouteMapper.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-star  vehicle-report', action: this.vehicleReport.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-chart-bar status', action: this.vehicleStates.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-handshake-o trip-settlement', action: this.tripSettlement.bind(this, this.vehicleTrips[i]) },

          ]
        }
        if (this.user._loggedInBy == "admin") {
        //  this.valobj['action'].icons.push({ class: 'fa fa-chart-pie change-status', action: this.openChangeStatusModal.bind(this, this.vehicleTrips[i]) });
        }


      }
      this.valobj['style'] = { background: this.vehicleTrips[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

}