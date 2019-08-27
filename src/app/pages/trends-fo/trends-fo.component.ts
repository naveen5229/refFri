import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';

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
  xScale='';
  dateDay = [];

  constructor(public common: CommonService,
    public api: ApiService,
    public datepipe: DatePipe, ) {
    this.foTrendsData();
  }

  ngOnInit() {
  }

  foTrendsData() {
    this.Details = [];
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
    };
  }
}
