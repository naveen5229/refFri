import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
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
  week_number='';
  month_number='';
  period='0';
  url = '';
  flag = 'Loading';
  bgColor='#00695C';
  yScale='Hours';
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

  getDefaultTrend(){
   //this.endDate=this.common.dateFormatter(new Date())
   let today=new Date();
   let endDay=new Date(today.setDate(today.getDate()-1))
   this.endDate=this.common.dateFormatter(endDay);
   let startday=new Date(today.setDate(today.getDate()-6));
   this.startDate=this.common.dateFormatter(startday);
   console.log('endDate',this.endDate);
   console.log('startDate',startday, this.startDate);
    this.getTrends();

  }

  getTrends() {
    this.Hours = [];
    this.dateDay = [];
    this.startDate = this.common.dateFormatter(this.startDate);
    this.endDate = this.common.dateFormatter(this.endDate);
    let params = {
      startDate: this.startDate,
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
          this.Hours.push(element.loading_hrs);
          this.showTables = true;
          this.flag = "Loading";
          this.showtrend = true;
          this.showChart();

        });
        // this.getSiteWise();
        // this.getVehicleWise();

      }, err => {
        this.common.loading--;
        this.common.showError();

      })

      this.getSiteWise();
      this.getVehicleWise();

  }

  showChart() {
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
      startDate: this.startDate,
      endDate: this.endDate
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Trends/getTrendsSiteWise', params)
      .subscribe(res => {
        this.common.loading--;
        this.siteDetails = res['data'];
        console.log('siteDetails: ', this.siteDetails);
        _.sortBy(this.siteDetails, ['unloading']).reverse().map(keyData => {
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
      startDate: this.startDate,
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

    this.Hours = [];
    console.log('changeTrendType:', 'call');
    this.Details.forEach((element) => {
      if (this.trendType == "11") {
        this.Hours.push(element.loading_hrs);
        this.showTables = true;
        this.flag = "Loading"
        this.bgColor='#00695C';
        this.yScale='Hours'
        this.showChart();
      } else if (this.trendType == "21") {
        this.Hours.push(element.unloading_hrs);
        this.showTables = true;
        this.flag = "UnLoading"
        this.bgColor='#E91E63';
        this.yScale='Hours'
        this.showChart();
      } else if (this.trendType == "0") {
        this.Hours.push(element.onward_per);
        this.showTables = false;
        this.flag = "onWard"
        this.bgColor='#4CAF50';
        this.yScale='percent'
        this.showChart();
      }


    });
  }

  getDate(type){

    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if(type=='start')
        this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
        else
        this.endDate=  this.common.dateFormatter(data.date).split(' ')[0];
        
      }

    });


  }

  changePeriod(){

  }


}
