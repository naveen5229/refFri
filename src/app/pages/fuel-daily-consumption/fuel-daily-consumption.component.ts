import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { DateService } from '../../services/date/date.service';
import { FuelDailyCunsumtionComponent } from '../../modals/fuel-daily-cunsumtion/fuel-daily-cunsumtion.component';
@Component({
  selector: 'fuel-daily-consumption',
  templateUrl: './fuel-daily-consumption.component.html',
  styleUrls: ['./fuel-daily-consumption.component.scss']
})
export class FuelDailyConsumptionComponent implements OnInit {

  startTime = null;
  endTime = null;
  reportType = 1;
  modelType = 0;
  modelTypes = [];
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
      },
      onClick: (e, item) => {
        console.log("e", e, item);
        if (!item.length) return;
        let index = item[0]['_index'];
        console.log(index);
        console.log('month data', this.Config.data);
        let label = this.Config.data.labels[index];
        let value = this.Config.data.datasets[0].data[index];
        console.log('Label:', label, 'Value:', value);
        let month = this.sortArray(label);
        console.log('fuel_daily_cumsion:', month, this.fuel_daily_cumsion);
        // let first_rec = this.fuel_daily_cumsion[0];
        // for (var key in first_rec) {
        //   if (key.charAt(0) != "_") {
        //     this.headings.push(key);
        //     let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        //     this.table.data.headings[key] = headerObj;
        //   }
        // }
        // console.log('heading data', this.table.data.headings);
        let temp = this.fuel_daily_cumsion;
       // this.fuel_daily_cumsion = [];
        let data = temp.filter(cumsion => {
          if (cumsion.Date.split('-')[1] == month) {
            console.log(cumsion.Date.split('-')[1], month);
            return true;
          }
          return false;
        });
        console.log('Data:', data);
        this.openfueldailycunsumption(data);

       // this.table.data.columns = this.getTableColumns(data);
        // setTimeout(() => {
        //   this.fuel_daily_cumsion = temp;
        //   this.openfueldailycunsumption(this.fuel_daily_cumsion);
        // }, 200);
      }
    },

  };
  flagType = '1';
  fuel_daily_cumsion = [];
  fuel_daily_cumsion_level2=[];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};
  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dateService: DateService,
    public user: UserService) {
    let today = new Date();
    this.endTime = new Date(today);
    let day = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    this.startTime = new Date(today.setDate(today.getDate() - 90));
    this.common.refresh = this.refresh.bind(this);
    this.getVehicleModals();
    this.getFuelDailyConsumption();
  }

  ngOnInit() {
  }


  refresh() {
    console.log('Refresh');
    this.getFuelDailyConsumption();
  }

  changeModal(type) {
    this.flagType = type;
  }

  getVehicleModals() {
  
    this.common.loading++;
    this.api.get('Suggestion/getVehicleModals')
      .subscribe(res => {
        this.common.loading--;
        this.modelTypes = res && res['data'] ? res['data'] : [];
      }, err => {
        this.common.loading--;
        console.log('Err:', err);
      });
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
      flagtype:1,
      modelType:this.modelType,
      reportType:this.reportType
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('Fuel/getfueldailyconsumption', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res json data:',res);
        // console.log('Res json data:', JSON.parse(res['data'][0]['y_json_data_level_1']));

        if (!res['data']) return;
        this.getChartData(res['data']);
        this.fuel_daily_cumsion=[];
        this.fuel_daily_cumsion_level2=[];
        if (res['data'][0]['y_json_data_level_1']) {
          this.fuel_daily_cumsion = JSON.parse(res['data'][0]['y_json_data_level_1']);
          this.fuel_daily_cumsion_level2 = JSON.parse(res['data'][0]['y_json_data_level_2']);
          console.log('double data',this.fuel_daily_cumsion);
        }
        // let first_rec = this.fuel_daily_cumsion[0];
        // for (var key in first_rec) {
        //   if (key.charAt(0) != "_") {
        //     this.headings.push(key);
        //     let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        //     this.table.data.headings[key] = headerObj;
        //   }
        // }
        // console.log('heading data', this.table.data.headings);
        // this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        console.log('Err:', err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns(fuel_daily_cumsion?) {
    let columns = [];
    if (!fuel_daily_cumsion)
      fuel_daily_cumsion = this.fuel_daily_cumsion;
    fuel_daily_cumsion.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });

    return columns;
  }

  getChartData(row) {
    let XLabel = [];
    let YValues = [];
    row.map(ele => {
      if (ele.y_date) {
        let formatedDate = this.dateService.format(ele.y_date, 'dd MMM yyyy');
        if (this.flagType == '1') {
          XLabel.push(formatedDate.split(' ')[0]);
        } else {
          XLabel.push(formatedDate.split(',')[0]);
        }
      }
      if (ele.y_consumption) {
        YValues.push(ele.y_consumption);
      }
    });

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

  sortArray(month) {
    console.log('month value', month);
    let montharr = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let searchvalue = montharr.indexOf(month) + 1;
    console.log('searchvalue', searchvalue);
    return searchvalue <= 9 ? '0' + searchvalue : searchvalue + '';
  }
  openfueldailycunsumption(consumtiondata){
    this.common.params = {
      reportType:this.reportType,
      consumtiondata:consumtiondata,
      fueldailycumsionlevel2:this.fuel_daily_cumsion_level2
    };
    const activeModal = this.modalService.open(FuelDailyCunsumtionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
    

    });
  }
}
