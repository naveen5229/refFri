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
            labelString: 'Month'
          }
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }
      }
    }
  };

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
      }, err => {
        this.common.loading--;
        console.log('Err:', err);
      });
  }


  getChartData(row) {
    console.log("Row------", row);
    var XLabel = [];
    var YValues = [];
    Object.keys(row).forEach(ele => {
      if (ele !== 'Kpi' && ele != '_kpi_id') {
        XLabel.push(ele);
        var datax = parseInt(row[ele].split('$')[0]);
        YValues.push(isNaN(datax) ? 0 : datax);
      }
    });
    this.Config.data = {
      labels: XLabel,
      datasets: [{

        label: 'Values',
        backgroundColor: '#FF0000',
        borderColor: '#FF0000',
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
