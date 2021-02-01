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



import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'toll-analatics',
  templateUrl: './toll-analatics.component.html',
  styleUrls: ['./toll-analatics.component.scss']
})
export class TollAnalaticsComponent implements OnInit {
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

  chartObject1 = {
    type: '',
    data: {},
    options: {},
    elements: {},
    lables: [],
    yAxes: [],
    ticks: {},
    min: '',
    max: '',
    stepSize: '',
    backgroundColor: ''
  };
  chartObject2 = {
    type: '',
    data: {},
    options: {},
    elements: {},
    lables: [],
    yAxes: [],
    ticks: {},
    min: '',
    max: '',
    stepSize: '',
    startAngle: '',
    backgroundColor: ''



  };
  zone = [];
  amounts = [];
  showGraph = false;
  amount = [];
  date = [];
  flag = 'Loading';
  bgColor = '#0000FF';
  yScale = 'Hours';
  // dates = {

  //   start: null,
  //   end: null,
  // };
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  data = [];
  data1 = [];
  remark = [];
  amt = [];
  type = 'line';
  datax = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {

    // this.getTollResponse();
    // let today = new Date();
    // let end = '';
    // let start = '';
    // start = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth() - 12, 1, 0, 0, 0));
    // end = this.common.dateFormatter1(new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
    // this.dates.start = start;
    // this.dates.end = end;
    this.getTollAnalatics();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getTollAnalatics();
  }

  // getDate(date) {
  //   this.common.params = { ref_page: "card usage" };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.dates);
  //   });
  // }

  showChart() {
    this.chartObject.type = 'line';
    this.chartObject.data = {
      // labels: this.dateDay ? this.dateDay : this.kmpdDate,
      labels: this.date,
      // render: 'percentage',

      datasets: [
        {
          label: 'Toll Consumption',
          percentFormatString: "#0.##",
          borderColor: this.bgColor,
          data: this.amount,
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#0000FF',
          lineTension: 0
        },
      ]
    };
    this.chartObject.options = {
      responsive: true,
      maintainAspectRatio: false,
    };
    console.log('This:', this.chartObject);
  }
  showbarGraph() {
    this.chartObject1.type = 'horizontalBar';
    this.chartObject1.data = {
      // labels: this.dateDay ? this.dateDay : this.kmpdDate,
      labels: this.remark,
      datasets: [
        {
          label: 'Top Toll Plaza',
          data: this.amt,
          // borderColor: this.bgColor,
          // data: this.amount,
          fill: false,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#0000FF',
          backgroundColor: this.bgColor
        },

      ]
    };
    this.chartObject1.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
            display: false // this is the same key that was passed to the registerScaleType function
        }]
    }
    };
    console.log('This:', this.chartObject);
  }
  showdoughnut() {
    this.chartObject2.type = 'doughnut';
    this.chartObject2.data = {
      // labels: this.dateDay ? this.dateDay : this.kmpdDate,
      labels: this.zone,
			percentFormatString: "#0.##",

      datasets: [
        {
          label: 'Zones',
          percentFormatString: "#0.##",
          render: 'percentage',

          data: this.amounts,
          backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"]
        },

      ]
    };
    this.chartObject2.options = {
      responsive: true,
      render: 'percentage',

			percentFormatString: "#0.##",

      maintainAspectRatio: false,
      
    };
    console.log('This:', this.chartObject);
  }



  getTollAnalatics() {

    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate))+"&mobileno=" + this.user._details.fo_mobileno+"&foid="+foid;

    this.common.loading++;
    let response;
    this.api.walle8Get('TollSummary/getTollAnalytics.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (res['data']) {
          this.amount = [];
          this.date = [];
          for (let i = 0; i < this.data.length; i++) {
            this.amount.push(this.data[i].amt);
            this.common.changeDateformat(this.date.push(this.data[i].transtime));
            // this.showGraph = true;
            // console.log('date', this.date);
          }
          // console.log('..................', this.amount, '..........', this.date);
        }

        this.showChart();
        //this.showbarGraph();

      }, err => {
        this.common.loading--;
        console.log(err);
      });


    let param = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate)) + "&type=1";

    this.common.loading++;

    this.api.walle8Get('TollSummary/getTollAnalytics.json?' + param)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (res['data']) {
          this.amt = [];
          this.remark = [];
          for (let i = 0; i < this.data.length; i++) {
            this.amt.push(this.data[i].amount);
            this.remark.push(this.data[i].remark);

          }
          //  console.log('..', this.amt, ',,', this.remark);
        }

        // this.showChart();
        this.showbarGraph();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    // return response;


    let par = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate)) + "&type=2";

    this.common.loading++;

    this.api.walle8Get('TollSummary/getTollAnalytics.json?' + par)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data1 = res['data'];
        if (res['data']) {
          this.zone = [];
          this.amounts = [];
          for (let i = 0; i < this.data1.length; i++) {
            this.zone.push(!this.data1[i].zone?'N.A':this.data1[i].zone);
            this.amounts.push(this.data1[i].amount);
            // this.zone.push(this.data1[i].zone);
            // this.amounts.push(this.data1[i].amount);

            console.log('zone', this.zone, '', this.amounts);
          }

        }
        this.showdoughnut();
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

}

