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
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';


@Component({
  selector: 'trip-summary',
  templateUrl: './trip-summary.component.html',
  styleUrls: ['./trip-summary.component.scss']
})
export class TripSummaryComponent implements OnInit {

  Hours = [];
  dateDay = [];
  startTime = new Date();
  endTime = new Date();
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
  vehicleTrips = [];
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
  Config = {
    type: 'line',
    data: null,
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Route Summary',
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


  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    let today = new Date();
    this.startTime = new Date(today.setDate(today.getDate() - 7));
    // this.startTime = this.common.dateFormatter(startDay);
    this.getTripSummary();
  }

  ngOnInit() {
  }
  refresh() {
    this.getTripSummary();
  }

  refreshData(row) {
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

  getTripSummary() {
    this.headings = [];
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
    this.Config.data = null;
    let startDate = this.common.dateFormatter1(this.startTime);
    let endDate = this.common.dateFormatter1(this.endTime);
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

        this.vehicleTrips = res['data'];
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
        console.log("column*******", this.headings[j]);

        if (this.headings[j] == "Kpi") {
          this.valobj[this.headings[j]] = { value: this.vehicleTrips[i][this.headings[j]], class: 'black', action: this.refreshData.bind(this, this.vehicleTrips[i]) };
        }
        else {
          this.valobj[this.headings[j]] = { value: this.getSplitData(this.vehicleTrips[i][this.headings[j]]), class: this.getSplitData(this.vehicleTrips[i][this.headings[j]]) != 0 ? 'blue' : 'black', action: this.getSplitData(this.vehicleTrips[i][this.headings[j]]) != 0 ? this.vehicleHistory.bind(this, this.vehicleTrips[i][this.headings[j]], this.vehicleTrips[i]._kpi_id) : '' };
        }

      }
      this.valobj['style'] = { background: this.vehicleTrips[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  getSplitData(data) {
    let showData = null;
    showData = data.split('$')[0];
    return showData;

  }



  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  vehicleHistory(column, id) {
    console.log("column", column);
    console.log("id", id);
    let getStartTime = null;
    let getEndTime = null;
    getStartTime = column.split('$')[1];
    getEndTime = column.split('$')[2];

    let dataparams = {
      view: {
        api: 'TripExpenseVoucher/getRouteTripSummaryDril',
        param: {
          startDate: getStartTime,
          endDate: getEndTime,
          type: id
        }
      },
      viewModal: {
        api: 'TripExpenseVoucher/getRouteTripSummaryDril',
        param: {
          startDate: '_start',
          endDate: '_end',
          type: '_type',
          id: '_id'
        }
      },
      title: "Trip Data"
    }
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }


}