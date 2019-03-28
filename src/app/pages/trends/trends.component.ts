import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import * as _ from 'lodash';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';



@Component({
  selector: 'trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.scss']
})
export class TrendsComponent implements OnInit {

  Hours = [];
  dateDay = [];
  startDate = '';
  endDate = '';
  showtrend = false;
  showTables = false;
  Details = [];
  siteDetails = [];
  vehicleDetails = [];
  showdate: any;
  trendType = '11';
  siteUnloading = [];
  vehicleUnloading = [];
  week_month_number = "4";
  period = "0";
  url = '';
  flag = 'Loading';
  bgColor = '#00695C';
  yScale = 'Hours';
  onWardFlag = false;
  fromDate='';
 // lastCategory='';
  lastDurationCategory='';
    
  chartObject = {
    type: '',
    data: {},
    options: {},
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

  }

  ngOnInit() { }

  getDefaultTrend() {

    let today, endDay, startday;
    today = new Date();
    endDay = new Date(today.setDate(today.getDate() - 1))
    this.endDate = this.common.dateFormatter(endDay);
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
      startday = new Date(today.setWeek(today.getWeek() - 4));
      this.startDate = this.common.dateFormatter(startday);
      console.log('endDate', this.endDate);
      console.log('startDate', startday, this.startDate);
      this.getweeklyTrend();
    } else {
      //  this.month_number='7';
      startday = new Date(today.setMonth(today.getMonth() - 4));
      this.startDate = this.common.dateFormatter(startday);
      console.log('endDate', this.endDate);
      console.log('startDate', startday, this.startDate);
      this.getMonthlyTrends();
    }

  }


  showChart() {
    console.log('date:showChart', this.dateDay);
    console.log('Hours:showChart', this.Hours);
    this.chartObject.type = 'line';
    this.chartObject.data = {
      labels: this.dateDay,

      datasets: [
        {
          //  label: this.flag,
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

      yAxes: [{
        ticks: {
          min: 100,
          max: 500,
          stepSize: 100
        }
      }]

    };
  }

  getSiteWise() {

    let params = {
      startDate: this.fromDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsSiteWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.siteDetails = res['data'];
        console.log('siteDetails: ', this.siteDetails);
        _.sortBy(this.siteDetails, ['unloading_hrs']).reverse().map(keyData => {
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
      startDate: this.fromDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsVehicleWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleDetails = res['data'];
        console.log('vehicleDetails: ', this.vehicleDetails);
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

  changeTrendType() {
    if (this.period == "0") {
      if(this.lastDurationCategory=='DayWise'){
        this.getCategoryDayWise();
      }
      else{
        this.getDayWiseTrends();
      }
    } else if (this.period == "1") {
      this.showTables=false;
      if(this.lastDurationCategory=='WeekWise')
      {
        this.getCategoryWeekWise();
      }
      else{
        this.getweeklyTrend();
      }
      
    } else {
      this.showTables=false;
      if(this.lastDurationCategory=='MonthWise'){
        this.getCategoryMonthWise();
      }else{
        this.getMonthlyTrends();
      }
    }

  }

  getDate(type) {
     this.endDate='';
     this.fromDate='';
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start')
          this.fromDate = this.common.dateFormatter(data.date).split(' ')[0];
        else
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];

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
    
    this.Details = [];
    console.log('getDayWiseTrends call');
    this.dateDay = [];
    this.fromDate = this.common.dateFormatter(this.fromDate);
    this.endDate = this.common.dateFormatter(this.endDate);
    let params = {
      startDate: this.fromDate,
      endDate: this.endDate
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
    this.lastDurationCategory='DayWise';
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
    this.Details = [];
    today = new Date();
    //endDay=new Date(today.setDate(today.getDate()-1))
    this.endDate = this.common.dateFormatter(today);
    let number = parseInt(this.week_month_number);
    console.log('converted number', number);
    startday = new Date(today.setDate(today.getDate() - number * 7));
    this.startDate = this.common.dateFormatter(startday);
    console.log('startDate:weekly', this.startDate);
    let params = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsWeekWise', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res:weekWise', res['data']);
        this.Details = res['data'];
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

    //   this.Hours = [];
    //   console.log('changeTrendType:', 'call');
    this.dateDay = [];
    this.Hours = [];
    this.lastDurationCategory='WeekWise';
    let number = parseInt(this.week_month_number);
    for (let i = 1; i <= number; i++) {
      this.dateDay.push(i);
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
    let today, startday;
    today = new Date();
    //endDay=new Date(today.setDate(today.getDate()-1))
    this.endDate = this.common.dateFormatter(today);
    let number = parseInt(this.week_month_number);
    console.log('converted number', number);
    startday = new Date(today.setMonth(today.getMonth() - number));
    this.startDate = this.common.dateFormatter(startday);
    console.log('startDate:monthly', this.startDate);
    let params = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsMonthWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.Details = res['data'];
        console.log('res:monthWise', res['data']);
        this.getCategoryMonthWise();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })


  }

  getCategoryMonthWise() {
    this.dateDay = [];
    this.Hours = [];
    this.lastDurationCategory='MonthWise';
    let number = parseInt(this.week_month_number);
    for (let i = 1; i <= number; i++) {
      this.dateDay.push(i);
    }
    console.log('dateDay:month ', this.dateDay);
    console.log('changeTrendType:', 'call');
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



}
