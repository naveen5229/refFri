import { Component, OnInit } from '@angular/core';
import { type } from 'os';
import { CommonService } from '../../services/common.service';
import * as Chart from 'chart.js';
import { ApiService } from '../../services/api.service';
import { EWayUpdateComponent } from '../../modals/e-way-update/e-way-update.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'e-way-bill-trip',
  templateUrl: './e-way-bill-trip.component.html',
  styleUrls: ['./e-way-bill-trip.component.scss']
})
export class EWayBillTripComponent implements OnInit {

  dataRange = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  }

  colors = ['#f4a522', '#6092cd', '#61b546', '#aa4498', '#d62728', '#89cdf0', '#9467bd']
  dashBoardData: any;;
  dashboardData = {
    cards: [],
    pieChart: [],
    doughnutChart: []
  };

  data = [];
  table = {
    heading: '',
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: false,
      pageLimit: null
    }
  };
  constructor(public common: CommonService, public api: ApiService, public modalService: NgbModal, private activeModal: NgbActiveModal) {
    this.getDashboard();
  }

  ngOnInit(): void {
  }

  getDashboard() {
    let params = `?fromDate=${this.common.dateFormatter1(this.dataRange.startDate)}&toDate=${this.common.dateFormatter1(this.dataRange.endDate)}`;
    this.common.loading++;
    this.api.get(`Eway/getEwayBillSummary` + params).subscribe(res => {
      this.common.loading--;
      this.dashBoardData = {};
      if (res['code'] == 1) {
        // if (!res['data']) return;
        this.dashBoardData = res['data'] ? res['data'] : {};
        this.arrangeDashboardData();
      } else {
        this.common.showError(res['msg']);
      }
    }, err => {
      this.common.loading--;
      this.common.showError();
    });
  }

  arrangeDashboardData() {
    this.dashboardData.cards = [];
    this.dashboardData.pieChart = [];
    this.dashboardData.doughnutChart = [];
    Object.keys(this.dashBoardData.billDetail).map(key => {
      this.dashboardData.cards.push({ title: this.formatTitle(key), count: this.dashBoardData.billDetail[key]['count'], data: this.dashBoardData.billDetail[key]['data'] ? this.dashBoardData.billDetail[key]['data'] : [] });
    });

    Object.keys(this.dashBoardData.billDetail).map(key => {
      if (key == 'Trip_Without_Eway_BIll' || key == 'Eway_Bill_Without_Vehicle' || key == 'Eway_BIll_With_Veh_Without_Trip') {
        this.dashboardData.doughnutChart.push({ title: this.formatTitle(key), count: this.dashBoardData.billDetail[key]['count'], data: this.dashBoardData.billDetail[key]['data'] ? this.dashBoardData.billDetail[key]['data'] : [] });
      }
    });

    Object.keys(this.dashBoardData.chartDetail).map(key => {
      this.dashboardData.pieChart.push({ title: this.formatTitle(key), count: this.dashBoardData.chartDetail[key]['count'], data: this.dashBoardData.chartDetail[key]['data'] ? this.dashBoardData.chartDetail[key]['data'] : [] });
    });
    this.renderDashboardScreen();
  }

  renderDashboardScreen() {
    let labelsPie = [];
    let chartDataSetPie = [];
    let labelsDoughnut = [];
    let chartDataSetDoughnut = [];
    this.dashboardData.pieChart.map((data, index) => {
      labelsPie.push(`${data.title} (${data.count})`);
      chartDataSetPie.push(data.count)
    });

    this.dashboardData.doughnutChart.map((data, index) => {
      labelsDoughnut.push(data.title);
      chartDataSetDoughnut.push(data.count)
    });

    var ctxPie = $('#pieGraph');
    var ctxDoughnut = $('#doughnutGraph');

    var graphPie = new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: labelsPie,
        datasets: [{
          label: "Sales",
          data: chartDataSetPie,
          fill: true,
          backgroundColor: ['#f50000', '#ff2e2e', '#ff4242', '#ff6b6b', '#00cc00', '#89cdf0', '#9467bd'],
          hoverOffset: 6
        }]
      },
      options: {
        onClick: (event, i) => {
          if (i && i.length > 0) {
            this.findDrillDownData(i[0]._index, 0);
          }
        },
        legend: {
          display: true,
          position: 'right'
        }
      }
    });

    var graphDoughnut = new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
        labels: labelsDoughnut,
        datasets: [{
          label: "Sales",
          data: chartDataSetDoughnut,
          fill: true,
          backgroundColor: ['#CCFF99', '#9999FF', '#FF99FF', '#B266FF', '#FF9999', '#66B2FF', '#FFCCFF'],
          hoverOffset: 6
        }]
      },
      options: {
        onClick: (event, i) => {
          if (i && i.length > 0) {
            this.findDrillDownData(i[0]._index, 1);
          }
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    });
    console.log(graphDoughnut,graphPie)
  }

  findDrillDownData(index, findFrom) {
    this.resetTable();
    if (!findFrom) {
      this.openDrillDown(this.dashboardData.pieChart[index].data, this.common.formatTitle(this.dashboardData.pieChart[index].title))
    } else {
      this.openDrillDown(this.dashboardData.doughnutChart[index].data, this.common.formatTitle(this.dashboardData.doughnutChart[index].title))
    }
  }

  formatTitle(title) {
    let res = "";
    title.split('_').forEach(element => {
      res += element + " ";
    });
    res = res == "" ? "" : res.substr(0, res.length - 1);
    return res.toUpperCase();
  }

  openDrillDown(smartTableData, title) {
    this.data = smartTableData;
    this.table.heading = title;
    if (this.data && this.data.length > 100) {
      this.table.settings.pagination = true;
      this.table.settings.pageLimit = 100
    };
    this.generateTable();
    if (this.data && this.data.length > 0) {
      document.getElementById('drillDown').style.display = 'block';
    }
  }

  generateTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns(),
    };
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.data[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = {
          title: key,
          placeholder: this.common.formatTitle(key),
        };
      }
    }
    headings['Action'] = {
      title: 'Action',
      placeholder: 'Action',
    }
    return headings;
  }

  getTableColumns() {
    let columns = [];
    this.data.map((data) => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == "Action") {
          column[key] = {
            value: "",
            isHTML: true,
            action: null,
            icons: this.actionIcons(data),
          };
        } else {
          column[key] = { value: data[key], class: "black", action: "" };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  actionIcons(data) {
    let icons = [];
    if (data._isextval) icons.push({ class: "far fa-calendar-check", action: this.editBill.bind(this, data), txt: "", title: '' });
    if (data._isupdpartb) icons.push({ class: "fa fa-edit partB pl-1", action: this.updatePartInfo.bind(this, data), txt: "", title: '' })
    return icons;
  }

  editBill(data) {
    this.common.params = {
      title: 'E-Way-Bill Date Extend',
      type: 1,
      api: 'Ewaybill/extndValidity',
      data
    };

    const activeModal = this.modalService.open(EWayUpdateComponent, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data.response) {
        // this.getCompanyBranches();
      }
    });
  }

  updatePartInfo(data) {
    this.common.params = {
      title: 'Update Part-B Info',
      type: 2,
      api: 'Ewaybill/updatePartB',
      data
    };

    const activeModal = this.modalService.open(EWayUpdateComponent, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data.response) {
        // this.getCompanyBranches();
      }
    });
  }

  cloaseDrillDown() {
    this.resetTable();
    document.getElementById('drillDown').style.display = 'none';
  }

  resetTable() {
    this.data = [];
    this.table = {
      heading: '',
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: false,
        pageLimit: null
      }
    };
  }

  fetchLatest() {
    let params = `?date=${this.common.dateFormatterGen(new Date())}`;
    this.common.loading++;
    this.api.getJavaPortDost(7000,`Ewaybill/getData`+params).subscribe(res => {
      this.common.loading--;
      if (res['code'] == 1) {
        this.common.showToast(res['msg']);
      } else {
        this.common.showError(res['msg']);
      }
    }, err => {
      this.common.loading--;
      this.common.showError();
    });
  }

}
