import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpisDetailsComponent } from '../../modals/kpis-details/kpis-details.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { from } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { slideToLeft, slideToUp } from '../../services/animation';
import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
import { log } from 'util';
import { ReportIssueComponent } from '../../modals/report-issue/report-issue.component';
import { componentRefresh } from '@angular/core/src/render3/instructions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'concise',
  templateUrl: './concise.component.html',
  styleUrls: ['./concise.component.scss', '../pages.component.css'],
  animations: [slideToLeft(), slideToUp()],
})
export class ConciseComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  kpis = [];
  allKpis = [];
  searchTxt = '';
  filters = [];
  viewType = 'showprim_status';
  viewName = "Primary Status";

  kpiGroups = null;
  kpiGroupsKeys = [];
  keyGroups = [];

  chartData = null;
  chartOptions = null;

  chartColors = [];
  textColor = [];
  viewIndex = 0;
  viewOtions = [
    {
      name: "Primary Status",
      key: "showprim_status"
    },
    {
      name: "Secondry Status",
      key: "showsec_status"
    },
    {
      name: "Trip Start",
      key: "x_showtripstart"
    },
    {
      name: "Trip End",
      key: "x_showtripend"
    },
  ];

  selectedFilterKey = '';

  table = null;

  primaryStatus = [];
  subPrimaryStatus = {};


  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService, private formBuilder: FormBuilder,
    private modalService: NgbModal) {
    this.getKPIS();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      search: ['', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
  }

  refresh() {
    console.log('Refresh');
    this.getKPIS();
  }


  getKPIS() {
    this.common.loading++;
    this.api.get('VehicleKpis')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.allKpis = res['data'];
        this.kpis = res['data'];
        this.grouping(this.viewType);
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    this.kpis.map((kpi, i) => {
      columns.push({
        vechile: { value: kpi.x_showveh, action: '', colActions: { dblclick: this.showDetails.bind(this, kpi) } },
        status: { value: kpi.showprim_status, action: '', colActions: { dblclick: this.showDetails.bind(this, kpi) } },
        hrs: { value: kpi.x_hrssince, action: '', colActions: { dblclick: this.showDetails.bind(this, kpi) } },
        trip: { value: this.getTripStatusHTML(kpi), action: '', isHTML: true, colActions: { dblclick: this.showDetails.bind(this, kpi) } },
        kmp: { value: kpi.x_kmph, action: '', colActions: { dblclick: this.showDetails.bind(this, kpi) } },
        location: { value: kpi.Address, action: this.showLocation.bind(this, kpi) },
        report: { value: `<i class="fa fa-question-circle"></i>`, isHTML: true, action: this.reportIssue.bind(this, kpi) },
        rowActions: {
          click: 'selectRow'
        }
      });
    });
    return columns;
  }

  getTripStatusHTML(kpi) {
    let html = '<div>';
    if (kpi.trip_status_type == 0) {
      html += `
      <!-- Heading -->
        <i class="fa fa-arrow-circle-right complete"></i>
        <span class="circle">${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 1) {
      html += `
      <!-- Loading -->
        <span class="circle">${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 2) {
      html += `
      <!-- Onward -->
        <span>${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 3) {
      html += `
        <!-- Unloading -->
          <span>${kpi.x_showtripstart}</span>
          <i class="icon ion-md-arrow-round-forward"></i>
          <span class="circle">${kpi.x_showtripend}</span>
        `;
    } else if (kpi.trip_status_type == 4) {
      html += `
      <!-- Complete -->
        <span>${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
        <i class="fa fa-check-circle complete"></i>
      `;
    } else {
      html += `
      <!-- Ambigous -->
        <span>${kpi.x_showtripstart}</span>
        <span class="icon ion-md-route-arrow">-</span>
        <span>${kpi.x_showtripend}</span>
      `;
    }
    return html + '</div>';
  }


  getViewType() {
    this.table.data.columns = this.getTableColumns();
    this.grouping(this.viewType);
  }


  grouping(viewType) {
    console.log('All ', this.allKpis);
    this.kpis = this.allKpis;
    this.kpiGroups = _.groupBy(this.allKpis, viewType);
    console.log("this.kpiGroups", this.kpiGroups);
    this.kpiGroupsKeys = Object.keys(this.kpiGroups);
    console.log("this.kpiGroupsKeys", this.kpiGroupsKeys);
    this.keyGroups = [];

    if (viewType == 'showprim_status') {
      this.primaryStatusGrouping();
      this.primaryStatus.map(primaryStatus => {
        const hue = Math.floor((Math.random() * 359) + 1);
        this.keyGroups.push({
          name: primaryStatus.name,
          bgColor: `hsl(${hue}, 100%, 75%)`,
          textColor: `hsl(${hue}, 100%, 25%)`
        });
        primaryStatus.bgColor = `hsl(${hue}, 100%, 75%)`;
        primaryStatus.textColor = `hsl(${hue}, 100%, 25%)`;
      });
    } else {
      this.kpiGroupsKeys.map(key => {
        const hue = Math.floor((Math.random() * 359) + 1);
        this.keyGroups.push({
          name: key,
          bgColor: `hsl(${hue}, 100%, 75%)`,
          textColor: `hsl(${hue}, 100%, 25%)`
        });
      });
    }

    this.sortData(viewType);

  }

  primaryStatusGrouping() {
    this.primaryStatus = [];
    this.allKpis.map(kpi => {
      let statusArray = kpi.showprim_status.split(',');
      let status = statusArray.splice(0, 1)[0].trim();
      let findStatus = false;
      let subStatus = statusArray.join(',').trim();
      this.primaryStatus.map(primaryStatus => {
        if (primaryStatus.name == status) {
          findStatus = true;
          primaryStatus.length++;
          primaryStatus.subStatus[subStatus] ? primaryStatus.subStatus[subStatus].push(kpi) : primaryStatus.subStatus[subStatus] = [kpi];
        }
      });

      if (!findStatus) {
        this.primaryStatus.push({ name: status, length: 1, subStatus: {} });
        this.primaryStatus[this.primaryStatus.length - 1].subStatus[subStatus] = [kpi];
      };

    });

    console.log('Status: ', this.primaryStatus);
  }

  sortData(viewType) {
    let data = [];
    this.chartColors = [];
    let chartLabels = [];
    let chartData = [];
    if (viewType == 'showprim_status') {
      this.primaryStatus.map(primaryStatus => {
        this.chartColors.push(primaryStatus.bgColor);
        chartLabels.push(primaryStatus.name + ' : ' + primaryStatus.length);
        chartData.push(primaryStatus.length);
      });
    } else {
      this.keyGroups.map(group => {
        data.push({ group: group, length: this.kpiGroups[group.name].length });
      });

      this.kpiGroupsKeys = [];
      _.sortBy(data, ['length']).reverse().map(keyData => {
        this.kpiGroupsKeys.push(keyData.group);
      });

      this.kpiGroupsKeys.map(keyGroup => {
        this.chartColors.push(keyGroup.bgColor);
        chartLabels.push(keyGroup.name + ' : ' + this.kpiGroups[keyGroup.name].length);
        chartData.push(this.kpiGroups[keyGroup.name].length);
      });

    }

    console.log(this.chartColors, this.kpiGroupsKeys);
    let chartInfo = this.common.pieChart(chartLabels, chartData, this.chartColors);
    this.chartData = chartInfo.chartData;
    this.chartOptions = chartInfo.chartOptions;

    this.selectedFilterKey && this.filterData(this.selectedFilterKey, viewType);


  }

  filterData(filterKey, viewType?) {
    if (this.viewType == 'showprim_status' || viewType == 'showprim_status') {
      this.kpis = [];
      console.log('-----------------Selected Secret Key: ', filterKey);
      if (filterKey == 'All') {
        this.primaryStatus.map(primaryStatus => {
          Object.keys(primaryStatus.subStatus).map(subStatus => {
            primaryStatus.subStatus[subStatus].map(kpi => {
              this.kpis.push(kpi);
            });
          });
        });
      } else {
        console.log('-------------------- Key Matched: ', filterKey, this.primaryStatus);

        for (let i = 0; i < this.primaryStatus.length; i++) {
          console.log('-------------------- Key Matched: ', filterKey, this.primaryStatus[i]);
          if (this.primaryStatus[i].name == filterKey) {
            console.log('-------------------- Key Matched: ', filterKey, this.primaryStatus[i]);
            console.log('-------------------- Sub Status: ', Object.keys(this.primaryStatus[i].subStatus), this.primaryStatus[i]);

            Object.keys(this.primaryStatus[i].subStatus).map(subStatus => {
              this.primaryStatus[i].subStatus[subStatus].map(kpi => {
                this.kpis.push(kpi);
              });
            });
            break;
          }
        }
      }
    } else if (filterKey == 'All') {
      this.kpis = this.allKpis;
    } else {
      this.selectedFilterKey = filterKey;
      console.log(filterKey, this.viewType);
      this.kpis = this.allKpis.filter(kpi => {
        if (kpi[this.viewType] == filterKey) return true;
        return false;
      });
    }
    this.table = this.setTable();
    console.log('Column: ', this.table);

  }

  showLocation(kpi) {
    if (!kpi.x_tlat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: kpi.x_tlat,
      lng: kpi.x_tlong,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }

  findVehicle() {
    if (!this.searchTxt) {
      this.kpis = this.allKpis;
    } else {
      this.kpis = this.allKpis.filter((kpi) => {
        return kpi.x_showveh.toUpperCase().includes(this.searchTxt.toUpperCase());
      });
    }
  }

  findFilters() {
    this.filters = ['all'];
    this.allKpis.map(kpi => {
      if (this.filters.indexOf(kpi.showprim_status) == -1) {
        this.filters.push(kpi.showprim_status);
      }
    });

  }

  showDetails(kpi) {
    this.common.params = { kpi };
    const activeModal = this.modalService.open(KpisDetailsComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'kpisDetails';
    // activeModal.result.then(data => {
    //     this.getKPIS();
    // });
  }



  getLR(kpi) {
    this.common.loading++;
    this.api.post('FoDetails/getLorryDetails', { x_lr_id: kpi.x_lr_id })
      .subscribe(res => {
        this.common.loading--;
        this.showLR(res['data'][0]);
        console.log("data", res);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  showLR(data) {
    let images = [
      {
        name: 'Lr',
        image: data.lr_image
      },
      {
        name: 'Invoice',
        image: data.invoice_image
      },
      {
        name: 'Other_Image',
        image: data.other_image
      }
    ];
    console.log("image", images)
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }

  changeOptions(type) {
    console.log("type", type);
    console.log("viewindex", this.viewIndex);
    if (type === "forward") {
      ++this.viewIndex;
      if (this.viewIndex > this.viewOtions.length - 1) {
        this.viewIndex = 0;
      }
    } else {
      --this.viewIndex;
      if (this.viewIndex < 0) {
        this.viewIndex = this.viewOtions.length - 1;
      }
    }
    this.viewType = this.viewOtions[this.viewIndex].key;
    this.viewName = this.viewOtions[this.viewIndex].name;
    this.grouping(this.viewType);
  }


  allData() {
    this.selectedFilterKey = '';
    //this.getKPIS();
    this.filterData('All');
  }

  reportIssue(kpi) {
    console.log('Kpi:', kpi);
    const activeModal = this.modalService.open(ReportIssueComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => data.status && this.common.reportAnIssue(data.issue, kpi.x_vehicle_id));
  }

  setTable() {
    return {
      data: {
        headings: {
          vechile: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
          status: { title: 'Status', placeholder: 'Status' },
          hrs: { title: 'Hrs', placeholder: 'Hrs ' },
          trip: { title: 'Trip', placeholder: 'Trip' },
          kmp: { title: 'Kmp', placeholder: 'KMP' },
          location: { title: 'Location', placeholder: 'Location' },
          report: { title: 'Report', placeholder: 'Report', hideSearch: true },
        },
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

}

