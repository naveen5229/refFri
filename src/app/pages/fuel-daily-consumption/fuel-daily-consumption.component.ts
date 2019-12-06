import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'fuel-daily-consumption',
  templateUrl: './fuel-daily-consumption.component.html',
  styleUrls: ['./fuel-daily-consumption.component.scss']
})
export class FuelDailyConsumptionComponent implements OnInit {

  startTime = null;
  endTime = null;
  Config = {
    type: 'line',
    data: null,
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Daily Fuel Consumption',
        fontSize: 14,
        fontColor: 'blue'
      },
      maintainAspectRatio: false,
      lineTension: 0,
      legend: {
        display: false
      },

      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Date'
          }
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Fuel'
          }
        }
      }
    }
  };

  getDailyFuelList = [];

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public user: UserService) {
    let today = new Date();
    this.endTime = new Date(today);
    let day = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    this.startTime = new Date(today.setDate(today.getDate() - 7));
    this.common.refresh = this.refresh.bind(this);
    this.getFuelDailyConsumption();
  }

  ngOnInit() {
  }


  refresh() {
    console.log('Refresh');
    this.getFuelDailyConsumption();
  }


  getFuelDailyConsumption() {
    this.Config.data = null;
    if (this.startTime > this.endTime) {
      this.common.showToast('start date should be less than end date');
      return;
    }
    let startDate = this.common.dateFormatter1(this.startTime);
    let endDate = this.common.dateFormatter1(this.endTime);
    const params = {
      startDate: startDate,
      endDate: endDate,
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('Fuel/getfueldailyconsumption', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        if (!res['data']) return;
        this.getDailyFuelList = res['data'] || [];
        this.getChartData(res['data']);
      }, err => {
        this.common.loading--;
        console.log('Err:', err);
      });
  }


  getChartData(row) {
    var XLabel = [];
    var YValues = [];
    row.map(ele => {
      if (ele.y_date) {
        XLabel.push(ele.y_date.split('-')[2]);
      }
      if (ele.y_consumption) {
        console.log("ele", ele);
        YValues.push(ele.y_consumption);
      }


      // XLabel.push(ele);
      // var datax = parseInt(row[ele].split('-')[2]);
      // YValues.push(isNaN(datax) ? 0 : datax);
    });




    // Object.keys(row).forEach(ele => {
    //   console.log('ele', ele);
    //   console.log('ele', row[ele]);

    //   var datax = parseInt(row[ele].split('-')[2]);
    //   YValues.push(isNaN(datax) ? 0 : datax);

    // });
    console.log("xlabel", XLabel);
    console.log("yLabel", YValues);

    this.Config.data = {
      labels: XLabel,
      datasets: [{

        label: 'Values',
        backgroundColor: '#3835ea',
        borderColor: '#3835ea',
        data: YValues,
        fill: false,
        lineTension: 0,

      },

      ],
      options: {
        legend: false
      }
    };
  }

}
