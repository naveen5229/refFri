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
  public doughnutChartLabels: string[] = ['test', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];

  colors = ['#f4a522', '#6092cd', '#61b546', '#aa4498', '#d62728', '#89cdf0', '#9467bd']
  dashBoardData: any;;
  dashboardData = {
    cards: [],
    pieChart: []
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
    this.common.loading++;
    this.api.get(`Eway/getEwayBillSummary`).subscribe(res => {
      this.common.loading--;
      this.dashBoardData = {};
      if (res['code'] == 1) {
        // if (!res['data']) return;
        this.dashBoardData = res['data'] ? res['data'] : {};
        this.arrangeDashboardData();
      } else {
        this.common.showError(res['msg']);
      }
      console.log('savedData:', this.dashBoardData);
    }, err => {
      this.common.loading--;
      console.log(err);
    });
  }

  arrangeDashboardData() {
    Object.keys(this.dashBoardData.billDetail).map(key => {
      this.dashboardData.cards.push({ title: this.formatTitle(key), count: this.dashBoardData.billDetail[key]['count'], data: this.dashBoardData.billDetail[key]['data'] ? this.dashBoardData.billDetail[key]['data'] : [] });
    });

    Object.keys(this.dashBoardData.chartDetail).map(key => {
      this.dashboardData.pieChart.push({ title: this.formatTitle(key), count: this.dashBoardData.chartDetail[key]['count'], data: this.dashBoardData.chartDetail[key]['data'] ? this.dashBoardData.chartDetail[key]['data'] : [] });
    });
    console.log(this.dashboardData)
    this.renderDashboardScreen();
  }

  renderDashboardScreen() {
    let labels = [];
    let chartDataSet = [];
    this.dashboardData.pieChart.map((data, index) => {
      labels.push(data.title);
      chartDataSet.push(data.count)
    })

    console.log('chartData', chartDataSet)

    var ctx = $('#Graph');
    var graph = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: "Sales",
          data: chartDataSet,
          fill: true,
          backgroundColor: ['#f50000', '#ff2e2e', '#ff4242', '#ff6b6b', '#00cc00', '#89cdf0', '#9467bd'],
          hoverOffset: 6
        }]
      },
      options: {
        onClick: (event, i) => {
          console.log(i, i[0]._index);
          this.findDrillDownData(i[0]._index);
        }
      }
    });
  }

  findDrillDownData(index) {
    console.log(this.dashboardData.pieChart, this.dashboardData.pieChart[index].data)
    this.resetTable();
    this.openDrillDown(this.dashboardData.pieChart[index].data, this.common.formatTitle(this.dashboardData.pieChart[index].title))
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
    console.log('smartTableData', smartTableData)
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
    let icons = [
      { class: "fa fa-edit", action: this.editBill.bind(this, data), txt: "", title: 'E-Way-Bill Date Extend' },
      { class: "fas fa-cog pl-1", action: this.updatePartInfo.bind(this, data), txt: "", title: 'Update Part-B Info' },
    ];
    return icons;
  }

  editBill(data) {
    return this.common.showToast('Under Development');
    console.log(data);
    this.common.params = {
      title: 'E-Way-Bill Date Extend',
      type: 1
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
    return this.common.showToast('Under Development');
    console.log(data);
    this.common.params = {
      title: 'Update Part-B Info',
      type: 2
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

}
