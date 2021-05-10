import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ResizeEvent } from "angular-resizable-element";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import * as _ from "lodash";
import * as moment from 'moment';
import { Api, Common, Csv, DateTime, Map, Pdf, User } from "../../services";
import {
  AddShortTarget,
  ChangeVehicleStatus,
  ChangeVehicleStatusByCustomer,
  EntityFlags,
  ImageView,
  KpisDetails,
  LocationMarker,
  OdoMeter,
  PoliceStation,
  ReportIssue,
  RouteMapper,
  TripDetails,
  VehicleOrders,
  VehicleReport,
  VehiclesOnMap,
  VehicleStates,
  VehicleTripUpdate
} from "../../modals";

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { NearByVehiclesComponent } from "../../modals/near-by-vehicles/near-by-vehicles.component";
import { ConciseColumnPrefrenceComponent } from "../../modals/concise-column-prefrence/concise-column-prefrence.component";
import { ConsoleReporter } from "jasmine";

@AutoUnsubscribe()
@Component({
  selector: "concise",
  templateUrl: "./concise.component.html",
  styleUrls: ["./concise.component.scss", "../pages.component.css", "print.scss"],
  host: {
    '(document:mousemove)': 'onMouseMove()'
  }
})
export class ConciseComponent implements OnInit {
  testingDate = this.common.dateFormatter(new Date(), '', false);
  registerForm: FormGroup;
  submitted = false;
  kpis = [];
  allKpis = [];
  searchTxt = "";
  filters = [];
  today = null;

  viewType = "showprim_status";
  viewName = "Primary Status";

  kpiGroups = null;
  kpiGroupsKeys = [];
  keyGroups = [];
  isCluster = false;
  markers = null;
  chartData = null;
  chartDataa = null;
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
      name: "Trip Start",
      key: "x_showtripstart"
    },
    {
      name: "Trip End",
      key: "x_showtripend"
    }
  ];
  selectedFilterKey = "";

  table = null;

  primaryStatus = [];

  subPrimaryStatus = {};
  secondaryStatus = [];

  activePrimaryStatus = "";
  primarySubStatus = [];

  widths = {
    smartTable: "40%",
    map: "60%"
  };

  isMapView = false;
  infoWindow = null;
  infoStart = null;
  isZoomed = false;
  lastRefreshTime = new Date();

  pdfData = {
    primary: {
      name: 'Primary',
      chartData: null,
      chartOptions: null,
      list: [],
      key: 'showprim_status',
    },
    tripStart: {
      name: 'Trip Start',
      chartData: null,
      chartOptions: null,
      list: [],
      key: 'x_showtripstart',
      kpiGroups: null,
    },
    tripEnd: {
      name: 'Trip End',
      chartData: null,
      chartOptions: null,
      list: [],
      key: 'x_showtripend',
      kpiGroups: null,
    },
    tables: []
  };

  subGroup = {
    name: undefined,
    data: []
  };
  rotate = '';
  gpsStatus = null;
  gpsStatusKeys = [];
  isHidePie: boolean = !!JSON.parse(localStorage.getItem('isHidePie'));
  subscriptions = [];
  markersWithId = [];
  preferences = [];
  kpiHeadings = [];

  constructor(
    public api: Api,
    public common: Common,
    public user: User,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public mapService: Map,
    private datePipe: DatePipe,
    public dateService: DateTime,
    private _sanitizer: DomSanitizer, private csvService: Csv,
    public pdfService: Pdf) {
    console.log("this.user._customer", this.user._customer, "this.user._details", this.user._details)
    this.getKPIS();
    this.common.currentPage = "";
    this.common.refresh = this.refresh.bind(this);
    this.today = new Date();

  }

  get f() {
    return this.registerForm.controls;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      search: ["", Validators.required]
    });
  }

  ngAfterViewInit() {
    this.common.stopScroll();
    this.subscriptions.push(this.mapService.events.subscribe(res => {
      if (res.type === 'closed' && this.isMapView) {
        this.initialiseMap();
      }
    }));
  }

  ngOnDestroy() {
    // this.mapService.map = null;
    this.common.continuoueScroll();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.registerForm.value));
  }

  refresh() {
    this.getKPIS();
  }

  getKPIS(isRefresh?) {
    this.lastRefreshTime = new Date();
    !isRefresh && this.common.loading++;
    let subscription = this.api.get("VehicleKpis/getVehicleKpisv1")
      .subscribe(res => {
        !isRefresh && this.common.loading--;
        if (res['code'] == 1) {
          // const keys = {
          //   "x_kmph": "kmp",
          //   "x_showtripstart": "trail",
          //   "x_idle_time": "Idle_Time",
          //   "x_hrssince": "hrs",
          //   "Address": "location",
          //   "showprim_status": "status",
          //   "x_vehicle_type": "vehicleType",
          //   "x_showveh": "vehicle"
          // };

          this.preferences = res['data'].y_columns.map(column => {
            return {
              key: [column.col_name],
              order: column.col_order,
              title: column.col_title_actual
            }
          }).filter(column => column.key);
          this.allKpis = res['data'].y_data;

          this.common.params = res['data'].y_data;
          console.log('kpi response data :', res['data'].y_data);
          console.log('kpi response y column :', res['data'].y_columns);

          localStorage.setItem('KPI_DATA', JSON.stringify(this.allKpis));
          this.kpis = this.allKpis;
          this.grouping(this.viewType);
          this.getGpsStatus();
          this.table = this.setTable();
          this.handlePdfPrint();
        }
        subscription.unsubscribe();
      }, err => {
        !isRefresh && this.common.loading--;
        console.error('getKPIs:', err);
        subscription.unsubscribe();
      });
  }

  getTableColumns(kpis?) {
    let columns = [];
    let kpisList = kpis || this.kpis;
    kpisList.map(ticket => {
      let column = {};
      for (let key in this.kpiHeadings) {
        if (key === 'x_actions') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(ticket['x_actions'])
          };
        } else if(key === 'x_hrssince'){
          column[key] = {
            value: this.convertHrsToDays(ticket['x_hrssince']),
            action: null,
            sortBy: ticket['x_hrssince']
          }
        } else if(key === 'x_idle_time'){
          column[key] = {
            value: this.common.changeTimeformat(ticket['x_idle_time']),
            action: null,
          }
        } else if(key === 'x_showtripstart'){
          column[key] = {
            value: this.common.getTripStatusHTML(ticket['trip_status_type'], ticket['x_showtripstart'], ticket['x_showtripend'], ticket['x_p_placement_type'], ticket['x_p_loc_name']),
            action: null,
            isHTML: true,
          }
        } else if(key === 'x_showveh'){
          column[key] = {
            value: this._sanitizer.bypassSecurityTrustHtml(`<span><div style='float:left;'>${ticket['x_showveh']}</div><div class="${ticket['x_gps_state'] == 'Offline' ? 'ball red' : ticket['x_gps_state'] == 'Online' ? 'ball bgreen' : ticket['x_gps_state'] == 'SIM' ? 'ball bgblue' : 'ball byellow'}" title=${ticket['x_gps_state']}></div></span>`),
                  action: '',
                  isHTML: true,
                  colActions: {
                    dblclick: '',
                    click: '',
                    mouseover: '',
                    mouseout: ''
                  }
          }
          column['_id'] = {
            value: ticket['x_showveh']
          }
        }
        else {
          column[key] = { value: ticket[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;

    // kpisList.map(kpi => {
    //   columns.push({
    //     _id: kpi.x_showveh,
    //     vehicle: {
    //       value: this._sanitizer.bypassSecurityTrustHtml(`<span><div style='float:left;'>${kpi.x_showveh}</div><div class="${kpi.x_gps_state == 'Offline' ? 'ball red' : kpi.x_gps_state == 'Online' ? 'ball bgreen' : kpi.x_gps_state == 'SIM' ? 'ball bgblue' : 'ball byellow'}" title=${kpi.x_gps_state}></div></span>`),
    //       action: '',
    //       isHTML: true,
    //       colActions: {
    //         dblclick: '',
    //         click: '',
    //         mouseover: '',
    //         mouseout: ''
    //       }
    //     },
    //     vehicleType: {
    //       value: kpi.x_vehicle_type,
    //       action: "",
    //     },
    //     status: {
    //       value: kpi.showprim_status,
    //       action: '',
    //     },
    //     location: {
    //       value: kpi.Address,
    //       action: ''
    //     },
    //     hrs: {
    //       value: this.convertHrsToDays(kpi.x_hrssince),
    //       action: "",
    //       sortBy: kpi.x_hrssince
    //     },
    //     Idle_Time: {
    //       value: this.common.changeTimeformat(kpi.x_idle_time),
    //       action: "",
    //     },
    //     trail: {
    //       value: this.common.getTripStatusHTML(kpi.trip_status_type, kpi.x_showtripstart, kpi.x_showtripend, kpi.x_p_placement_type, kpi.x_p_loc_name),
    //       action: '',
    //       isHTML: true,
    //     },
    //     kmp: {
    //       value: kpi.x_kmph,
    //       action: "",
    //     },

    //     action: {
    //       value: "",
    //       isHTML: false,
    //       action: null,
    //       icons: this.actionIcons(kpi.x_actions)
    //     }
    //   });
    // });


    return columns;
  }

  convertHrsToDays(hrs: number) {
    let days = Math.floor(hrs / 24);
    let remainingHrs = hrs % 24;
    let str = '';
    if (days) {
      str = days + 'd ';
    }
    if (remainingHrs) {
      str += remainingHrs + 'h';
    }
    return str.trim();
  }

  getViewType() {
    this.table.data.columns = this.getTableColumns();
    this.grouping(this.viewType);
  }

  grouping(viewType) {
    this.kpis = this.allKpis;
    this.kpiGroups = _.groupBy(this.allKpis, viewType);
    if ((this.viewType === 'x_showtripend' || this.viewType === 'x_showtripstart') && this.kpiGroups['']) {
      let xGroup = {};
      this.kpiGroups[''].forEach(item => {
        let key = '';
        if (item.placements.length) {
          key = item.placements[0].name;
        }
        if (key in xGroup) {
          xGroup[key].push(item);
        } else {
          xGroup[key] = [item];
        }
      });

      this.kpiGroups[''] = xGroup[''];
      delete xGroup[''];
      if (!this.kpiGroups[''] || !this.kpiGroups[''].length) {
        delete this.kpiGroups[''];
      }

      Object.keys(xGroup).forEach(key => {
        if (key in this.kpiGroups) {
          this.kpiGroups[key].push(...xGroup[key]);
        } else {
          this.kpiGroups[key] = xGroup[key];
        }
      });
    }

    Object.keys(this.kpiGroups).forEach(key => {
      if (key.includes('#')) {
        // let xKey = key.split('-').map(k => k.split('#')[0]).join(' - ');
        let xKey = key.split('#')[0];
        if (xKey in this.kpiGroups) {
          this.kpiGroups[xKey].push(...this.kpiGroups[key]);
        } else {
          this.kpiGroups[xKey] = this.kpiGroups[key];
        }
        delete this.kpiGroups[key];
      }
    });
    this.kpiGroupsKeys = Object.keys(this.kpiGroups);
    this.keyGroups = [];

    if (viewType == "showprim_status") {
      this.primaryStatusGrouping();
      this.primaryStatus.map(primaryStatus => {
        const hue = Math.floor(Math.random() * 359 + 1);
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
        const hue = Math.floor(Math.random() * 359 + 1);
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
      let statusArray = kpi.showprim_status.split(",");
      let status = statusArray.splice(0, 1)[0].trim();
      let subStatus = statusArray.join(",").trim();
      let findStatus = false;
      if (status && status.includes('No Data')) {
        subStatus = status.substr(status.search(/[0-9]/)).split(' ')[0] + ' Hr +';
        status = "Issue";
      } else if (status == "Undetected") {
        status = "Issue";
        subStatus = "Undetected";
      } else if (status == "No GPS Data") {
        status = "Issue";
        subStatus = "No GPS Data";
      }
      this.primaryStatus.map(primaryStatus => {
        if (primaryStatus.name == status) {
          findStatus = true;
          primaryStatus.length++;
          primaryStatus.subStatus[subStatus]
            ? primaryStatus.subStatus[subStatus].push(kpi)
            : (primaryStatus.subStatus[subStatus] = [kpi]);
        }
      });

      if (!findStatus) {
        this.primaryStatus.push({ name: status, length: 1, subStatus: {} });
        this.primaryStatus[this.primaryStatus.length - 1].subStatus[
          subStatus
        ] = [kpi];
      }
    });
  }

  sortData(viewType) {
    let data = [];
    this.chartColors = [];
    let chartLabels = [];
    let chartData = [];
    if (viewType == "showprim_status") {
      this.primaryStatus = _.sortBy(this.primaryStatus, ["length"]).reverse();
      this.primaryStatus.map(primaryStatus => {
        this.chartColors.push(primaryStatus.bgColor);
        chartLabels.push(primaryStatus.name);
        chartData.push(primaryStatus.length);
      });
    } else {
      this.keyGroups.map(group => {
        data.push({ group: group, length: this.kpiGroups[group.name].length });
      });

      this.kpiGroupsKeys = [];
      _.sortBy(data, ["length"])
        .reverse()
        .map(keyData => {
          this.kpiGroupsKeys.push(keyData.group);
        });

      this.kpiGroupsKeys.map(keyGroup => {
        this.chartColors.push(keyGroup.bgColor);
        chartLabels.push(keyGroup.name);
        chartData.push(this.kpiGroups[keyGroup.name].length);
      });
    }

    let chartInfo = this.common.pieChart(
      chartLabels,
      chartData,
      this.chartColors
    );
    this.chartData = chartInfo.chartData;
    this.chartOptions = chartInfo.chartOptions;
    this.selectedFilterKey && this.filterData(this.selectedFilterKey, viewType);
  }

  filterData(filterKey, viewType?) {
    if (this.viewType == "showprim_status" || viewType == "showprim_status") {
      this.kpis = [];
      if (filterKey == "All") {
        this.primaryStatus.map(primaryStatus => {
          Object.keys(primaryStatus.subStatus).map(subStatus => {
            primaryStatus.subStatus[subStatus].map(kpi => {
              this.kpis.push(kpi);
            });
          });
        });
      } else {
        for (let i = 0; i < this.primaryStatus.length; i++) {
          if (this.primaryStatus[i].name == filterKey) {
            Object.keys(this.primaryStatus[i].subStatus).map(subStatus => {
              this.primaryStatus[i].subStatus[subStatus].map(kpi => {
                this.kpis.push(kpi);
              });
            });
            break;
          }
        }
      }
    } else if (filterKey == "All") {
      this.kpis = this.allKpis;
    } else {
      this.selectedFilterKey = filterKey;

      this.kpis = this.allKpis.filter(kpi => {
        let value = kpi[this.viewType].split('-').map(k => k.split('#')[0]).join(' - ');
        return value == filterKey;

      });


      if (this.viewType === 'x_showtripend' && filterKey != '') {
        let kpiGroups = _.groupBy(this.allKpis, this.viewType);
        let xGroup = {};
        kpiGroups[''].forEach(item => {
          let key = '';
          if (item.placements && item.placements.length) {
            key = item.placements[0].name;
            if (key in xGroup) {
              xGroup[key].push(item);
            } else {
              xGroup[key] = [item];
            }
          }
        });
        Object.keys(xGroup).forEach(key => {
          if (key === filterKey)
            this.kpis.push(...xGroup[key]);
        });
      }
    }
    this.table = this.setTable();
  }

  filterSubStatus(filterKey) {
    if (this.subGroup.name == filterKey) {
      this.subGroup = {
        name: undefined,
        data: []
      }
      return;
    }

    let kpis = this.allKpis.filter(kpi => {
      let value = kpi[this.viewType].split('#')[0];
      if (value == filterKey) {
        if (filterKey === '') {
          if (kpi.placements && kpi.placements.length) {
            return false;
          }
        }
        return true;
      }
      return false;
    });

    let placements = this.allKpis.filter(kpi => !kpi[this.viewType])
      .filter(kpi => {
        if (kpi.placements && kpi.placements.length) {
          if (kpi.placements[0].name === filterKey)
            return true;
        }
        return false;
      })
    kpis.push(...placements);

    if (kpis.length < 2) {
      this.selectSubStatus(kpis);
      this.subGroup = {
        name: undefined,
        data: []
      }
      return;
    }

    let groups = _.groupBy(kpis, this.viewType === 'x_showtripend' ? 'x_showtripstart' : 'x_showtripend');
    if ((this.viewType === 'x_showtripend' || this.viewType === 'x_showtripstart') && groups['']) {
      let xGroup = {};
      groups[''].forEach(item => {
        let key = '';
        if (item.placements && item.placements.length) {
          key = item.placements[0].name;
          if (key in xGroup) {
            xGroup[key].push(item);
          } else {
            xGroup[key] = [item];
          }
        }
      });
      Object.keys(xGroup).forEach(key => {
        if (key === '') {
          groups[''] = xGroup[key]
        } else if (key in groups) {
          groups[key].push(...xGroup[key])
        } else {
          groups[key] = xGroup[key];
        }

      });
    }
    delete groups[''];
    let keysForDelete = [];
    Object.keys(groups).forEach(key => {
      let formattedKey = key.split('#')[0];
      if (formattedKey !== key) {
        if (formattedKey in groups) {
          groups[formattedKey].push(...groups[key]);
          if (keysForDelete.indexOf(key) === -1) {
            keysForDelete.push(key);
          }
        } else {
          groups[formattedKey] = groups[key];
          keysForDelete.push(key);
        }
      }
    });
    keysForDelete.forEach(key => delete groups[key]);
    groups['All'] = kpis;
    this.subGroup.name = filterKey;
    this.subGroup.data = Object.keys(groups).map(key => {
      return {
        name: key,
        kpi: groups[key]
      }
    }).sort((a, b) => a.kpi.length < b.kpi.length ? 1 : -1).slice(0, 6);
  }

  showLocation(kpi) {
    if (!kpi.x_tlat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: kpi.x_tlat,
      lng: kpi.x_tlong,
      angle: kpi.x_angle,
      name: "",
      time: ""
    };
    this.common.params = { location, title: "Vehicle Location : " + kpi.x_showveh };
    this.modalService.open(LocationMarker, {
      size: "lg",
      container: "nb-layout"
    });
  }

  findVehicle() {
    if (!this.searchTxt) {
      this.kpis = this.allKpis;
    } else {
      this.kpis = this.allKpis.filter(kpi => {
        return kpi.x_showveh
          .toUpperCase()
          .includes(this.searchTxt.toUpperCase());
      });
    }
  }

  findFilters() {
    this.filters = ["all"];
    this.allKpis.map(kpi => {
      if (this.filters.indexOf(kpi.showprim_status) == -1) {
        this.filters.push(kpi.showprim_status);
      }
    });
  }

  showDetails(kpi) {
    this.common.params = { kpi };
    const activeModal = this.modalService.open(KpisDetails, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.componentInstance.modalHeader = "kpisDetails";
  }

  getLR(kpi) {
    this.common.loading++;
    let subscription = this.api.post("FoDetails/getLorryDetails", { x_lr_id: kpi.x_lr_id })
      .subscribe((res: any) => {
        this.common.loading--;
        if (res.data && res.data.length)
          this.showLR(res.data[0]);
        subscription.unsubscribe();
      }, err => {
        this.common.loading--;
        console.error('getLR: ', err);
        subscription.unsubscribe();
      });
  }

  showLR(data) {
    let images = [
      {
        name: "Lr",
        image: data.lr_image
      },
      {
        name: "Invoice",
        image: data.invoice_image
      },
      {
        name: "Other_Image",
        image: data.other_image
      }
    ];
    this.common.params = { images, title: "LR Details" };
    this.modalService.open(ImageView, {
      size: "lg",
      container: "nb-layout"
    });
  }

  changeOptions(type) {
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
    this.selectedFilterKey = "";
    this.filterData("All");
  }

  reportIssue(kpi) {
    this.common.params = { refPage: "db" };
    const activeModal = this.modalService.open(ReportIssue, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(
      data =>
        data.status && this.common.reportAnIssue(data.issue, kpi.x_vehicle_id)
    );
  }

  setTable(kpis?) {
    let preferences = this.preferences.length ? this.preferences : [
      { key: 'vehicle', order: 1, title: 'Vehicle No' },
      { key: 'vehicleType', order: 2, title: 'Veh Type' },
      { key: 'status', order: 3, title: 'Status' },
      { key: 'location', order: 4, title: 'Location' },
      { key: 'hrs', order: 5, title: 'Hrs' },
      { key: 'Idle_Time', order: 6, title: 'Idle Time' },
      { key: 'trail', order: 7, title: 'Trail' },
      { key: 'kmp', order: 8, title: 'KMP' },
    ];

    console.log('this.prefrences :', this.preferences);

    //preferences.filter(pre=>pre.show)
    preferences = preferences.sort((a, b) => a.order > b.order ? 1 : -1);
    let headings = {};
    preferences.map(heading => {
      headings[heading.key] = { title: heading.title, placeholder: heading.title, key: heading }
    });

    Object.assign(this.kpiHeadings, {...headings});
    console.log('kpiHeadings data is: ', this.kpiHeadings)

    return {
      data: {
        headings: {
          // vehicle: { title: "Vehicle Number", placeholder: "Vehicle No" },
          // vehicleType: { title: "Vehicle Type", placeholder: "Veh Type" },
          // status: { title: "Status", placeholder: "Status" },
          // location: { title: "Location", placeholder: "Location" },
          // hrs: { title: "Hrs", placeholder: "Hrs " },
          // Idle_Time: { title: "Idle Time", placeholder: "Idle Time" },
          // trail: { title: "Trail", placeholder: "Trail" },
          // kmp: { title: "Kmp", placeholder: "KMP" },
          ...headings,
          // action: { title: "Action", placeholder: "", hideSearch: true }
        },
        columns: this.getTableColumns(kpis)
      },
      settings: {
        hideHeader: true,
        count: {
          icon: "fa fa-map",
          action: this.handleMapView.bind(this),
        },
        pagination: true,
        tableHeight: "87vh",
        oneAction: true,
        selectRow: true,
        selectMultiRow: false
      },


    };
  }

  choosePrimarySubStatus(primaryStatus) {
    if (primaryStatus.name == this.activePrimaryStatus) {
      this.activePrimaryStatus = "";
      this.primarySubStatus = [];
      return;
    }
    if (Object.keys(primaryStatus.subStatus).length == 1) {
      this.kpis =
        primaryStatus.subStatus[Object.keys(primaryStatus.subStatus)[0]];
      this.table = this.setTable();
      this.primarySubStatus = [];
      this.activePrimaryStatus = "";
      return;
    }

    let options = [];
    Object.keys(primaryStatus.subStatus).map((subStatus, index) => {
      if (index == 0) options.push({ id: 0, name: "All", kpis: [] });
      primaryStatus.subStatus[subStatus].map(kpi =>
        options[0].kpis.push(Object.assign({}, kpi))
      );
      options.push({
        id: index + 1,
        name:
          (subStatus || primaryStatus.name) +
          " : " +
          primaryStatus.subStatus[subStatus].length,
        kpis: primaryStatus.subStatus[subStatus]
      });
    });

    options[0].name += " : " + options[0].kpis.length;
    this.primarySubStatus = options;
    this.activePrimaryStatus = primaryStatus.name;
  }

  selectSubStatus(kpis) {
    this.kpis = kpis;
    this.table = this.setTable();
  }

  vehicleReport(kpi) {
    this.common.params = {
      vehicleId: kpi.x_vehicle_id,
      vehicleRegNo: kpi.x_showveh,
      ref_page: "consView"
    };
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.modalService.open(VehicleReport, {
      size: "lg",
      container: "nb-layout",
      backdrop: "static",
      windowClass: "myCustomModalClass"
    });
  }

  openRouteMapper(kpi) {
    let today, startday, fromDate;
    today = new Date();
    startday = kpi.x_showstarttime ? this.common.dateFormatter(kpi.x_showstarttime) : new Date(today.setDate(today.getDate() - 2));
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: kpi.x_vehicle_id,
      vehicleRegNo: kpi.x_showveh,
      fromTime: fromTime,
      toTime: toTime
    };
    this.modalService.open(RouteMapper, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });

  }

  openTripDetails(kpi) {
    let today, startday, fromDate;
    today = new Date();
    startday = new Date(today.setMonth(today.getMonth() - 2));
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());
    this.common.params = {
      vehicleId: kpi.x_vehicle_id,
      vehicleRegNo: kpi.x_showveh,
      fromTime: fromTime,
      toTime: toTime
    };
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.modalService.open(TripDetails, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
  }

  vehicleOnMap() {
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = { vehicles: this.kpis };
    this.modalService.open(VehiclesOnMap, {
      size: "lg",
      container: "nb-layout"
    });
  }

  onResizeEnd(event: ResizeEvent, type): void {
    this.widths[type] = event.rectangle.width + "px";
  }

  initialiseMap() {
    this.mapService.mapIntialize("concise-view-map", 18, 25, 75, false, true);
    this.mapService.clearAll();
    for (let index = 0; index < this.kpis.length; index++) {
      if (this.kpis[index].showprim_status.includes('No Data') || this.kpis[index].showprim_status == "Undetected" || this.kpis[index].showprim_status == "No GPS Data") {
        this.kpis[index].color = "ff0000";
      } else if ((this.kpis[index].x_idle_time / 60) > 0) {
        this.kpis[index].color = "ffff00";
      } else {
        this.kpis[index].color = "00ff00";
      }
    }
    setTimeout(() => {
      this.mapService.setMapType(0);
      this.markers = this.mapService.createMarkers(this.kpis);
      // x_vehicle_id
      this.markersWithId = this.markers.map((marker, index) => {
        return { marker, id: this.kpis[index].x_showveh }
      })

      this.mapService.addListerner(this.mapService.map, "center_changed", () => {
        //this.setMarkerLabels();
      });
      this.mapService.addListerner(this.mapService.map, "zoom_changed", () => {
        // this.setMarkerLabels();
      });
      let markerIndex = 0;
      for (const marker of this.mapService.markers) {
        let event = this.kpis[markerIndex];
        this.mapService.addListerner(marker, "mouseover", () =>
          this.setEventInfo(event)
        );
        this.mapService.addListerner(marker, "mouseout", () =>
          this.unsetEventInfo()
        );
        markerIndex++;
      }
    }, 1000);
  }

  setMarkerLabels() {
    if (this.mapService.markers.length != 0) {
      for (const zoomMarker of this.mapService.markers) {
        zoomMarker.setLabel("");
      }
    }
    if (this.mapService.map.getZoom() >= 9) {
      for (let index = 0; index < this.mapService.markers.length; index++) {
        const element = this.mapService.markers[index];
        element.setLabel(this.kpis[index].x_showveh);
      }
    }
  }

  createCluster() {
    if (this.isCluster) {
      for (let i = 0; i < this.markers.length; i++) {
        if (this.markers[i])
          this.markers[i].title = this.kpis[i].x_showveh;
      }
      this.mapService.createCluster(this.markers, true);
    } else {
      this.mapService.createCluster(this.markers, false);
    }
  }

  setEventInfo(event) {
    this.infoStart = new Date().getTime();
    if (this.infoWindow)
      this.infoWindow.close();
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(
      `
      <b>Vehicle:</b>${event.x_showveh} <br>
      <span><b>Trip:</b>${this.common.getTripStatusHTML(event.trip_status_type, event.x_showtripstart, event.x_showtripend, event.x_p_placement_type, event.x_p_loc_name)}</span> <br>
      <b>Status:</b>${event.showprim_status} <br>
      <b>Location:</b>${event.Address} <br>
      `
    );
    this.rotateBounce(event, null, false);
    this.infoWindow.setPosition(
      this.mapService.createLatLng(event.x_tlat, event.x_tlong)
    ); // or evt.latLng
    this.infoWindow.open(this.mapService.map);
  }

  unsetEventInfo() {
    let diff = new Date().getTime() - this.infoStart;
    if (diff > 500) {
      this.infoWindow.close();
      this.infoWindow.opened = false;
    }
  }

  handleMapView() {
    if (this.isZoomed) {
      this.isZoomed = false;
      this.mapService.setMapType(0);
      this.mapService.resetBounds();
      return;
    }
    this.isMapView = !this.isMapView;
    setTimeout(() => {
      this.initialiseMap();
    }, 1000);
  }

  rotateBounce(kpi, i?, isToggle = true) {
    this.rotate = 'rotate(' + kpi.x_angle + 'deg)';
    if (isToggle) {
      this.mapService.toggleBounceMF(i);
    }
  }

  getUpdate(kpi) {
    let tripDetails = {
      vehicleId: kpi.x_vehicle_id,
      siteId: kpi.x_hl_site_id

    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'kpi' };
    this.modalService.open(VehicleTripUpdate, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  getZoomAndaddShortTarget(kpi) {
    if (this.isMapView) {
      this.getZoom(kpi)
    } else {
      this.addShortTarget(kpi);
    }
  }

  getZoom(kpi) {
    if (this.isMapView && kpi) {
      let latLng = this.mapService.getLatLngValue(kpi);
      let latLong = this.mapService.createLatLng(latLng.lat, latLng.lng)
      this.mapService.zoomAt(latLong);
      this.isZoomed = true;
    }
  }

  actionIcons(x_actions) {
    let actions = x_actions || ["chvehstatus", "vehevent", "routemap", "trips", "vehstates", "rptissue", "nearby", "odometer", "entityflag", "vehorders", "calldriver", "nearby"];
    let icons = [
      {
        class: "icon fa fa-chart-pie", action: '', key: "chvehstatus"
      },
      {
        class: "icon fa fa-star",
        action: '',
        key: 'vehevent'
      },
      {
        class: "icon fa fa-route",
        action: '',
        key: 'routemap'
      },
      {
        class: "icon fa fa-truck",
        action: '',
        key: 'trips'
      },
      {
        class: "icon fa fa-globe",
        action: '',
        key: 'vehstates'
      },
      {
        class: "icon fa fa-question-circle",
        action: '',
        key: 'rptissue'
      },
      {
        class: "icon fa fa-map-marker",
        action: '',
        key: 'nearby'
      },
      {
        class: "icon fas fa-tachometer-alt",
        action: '',
        key: 'odometer'
      },
      {
        class: "icon fas fa-flag-checkered",
        action: '',
        key: 'entityflag'
      },
      {
        class: "icon fa fa-gavel",
        action: '',
        key: 'vehorders'
      },
      {
        class: "icon fa fa-phone",
        action: '',
        key: 'calldriver'
      }
    ];

    return icons.filter((icon, index) => {
      if (actions.indexOf(icon.key) != -1) {
        return true;
      }
      return false;
    })
  }

  openChangeStatusModal(trip) {
    console.log('trip is:', trip);
    
    let ltime = new Date();
    let tTime = this.common.dateFormatter(new Date());
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);

    let VehicleStatusData = {
      id: trip.id,
      vehicle_id: trip.x_vehicle_id,
      tTime: tTime,
      suggest: null,
      latch_time: latch_time,
      status: 2,
      remark: trip.remark,
      regno: trip.x_showveh,
      tripName: this.common.getTripStatusHTML(trip.trip_status_type, trip.x_showtripstart, trip.x_showtripend, trip.x_p_placement_type, trip.x_p_loc_name)
    };
    this.common.ref_page = 'tsfl';
    this.common.params = VehicleStatusData;
    if (this.user._loggedInBy != "admin") {
      this.modalService.open(ChangeVehicleStatusByCustomer, { size: 'lg', container: 'nb-layout' });
    } else {
      this.modalService.open(ChangeVehicleStatus, { size: 'lg', container: 'nb-layout' });
    }
  }

  openVehicleStates(values) {
    this.common.params = {
      vehicleId: values.x_vehicle_id,
      vehicleRegNo: values.x_showveh,
      lat: values.x_tlat,
      long: values.x_tlong,
      vregno: values.x_showveh

    };
    this.modalService.open(VehicleStates, {
      size: "lg",
      container: "nb-layout"
    });
  }

  onMouseMove() {
    let now = moment(new Date()); //todays date
    let lastRefreshTime = moment(this.lastRefreshTime); // another date
    let duration = moment.duration(now.diff(lastRefreshTime));
    let minutes = duration.asMinutes();
    if (minutes >= 5) {
      this.getKPIS(true);
    }
  }

  addShortTarget(target) {
    this.common.params = {
      vehicleId: target.x_vehicle_id,
      vehicleRegNo: target.x_showveh

    };
    this.modalService.open(AddShortTarget, {
      size: "sm",
      container: "nb-layout"
    });
  }

  openStations(kpi) {
    let vehicles = this.allKpis.filter(vehicle => {
      if (!vehicle.x_tlat || !vehicle.x_tlong || (vehicle.x_showveh == kpi.x_showveh)) {
        return false;
      }

      let distance = this.common.distanceFromAToB(kpi.x_tlat, kpi.x_tlong, vehicle.x_tlat, vehicle.x_tlong, 'K');
      if (distance <= 50)
        return true;
      return false;
    }).map(vehicle => {
      return {
        lat: vehicle.x_tlat,
        lng: vehicle.x_tlong,
        name: vehicle.x_showveh,
        distance: this.common.distanceFromAToB(kpi.x_tlat, kpi.x_tlong, vehicle.x_tlat, vehicle.x_tlong, 'K')
      }
    }).sort((a, b) => a.distance > b.distance ? 1 : -1)


    this.common.params = {
      lat: kpi.x_tlat,
      long: kpi.x_tlong,
      name: kpi.x_showveh,
      vehicles
    };

    this.modalService.open(PoliceStation, {
      size: "lg",
      container: "nb-layout"
    });


  }

  openOdoMeter(kpi) {
    let vehicleId = kpi.x_vehicle_id;
    let regno = kpi.x_showveh;
    this.common.params = { vehicleId, regno };
    this.modalService.open(OdoMeter, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  openentityFlag(kpi) {
    this.common.handleModalSize('class', 'modal-lg', '800');
    let vehicleId = kpi.x_vehicle_id;
    let regno = kpi.x_showveh;
    this.common.params = { title: 'Entity Flag ', vehicleId, regno };
    this.modalService.open(EntityFlags, {
      size: 'lg',
      container: 'nb-layout',
      backdrop: 'static',
      windowClass: 'print-lr'
    });
  }

  openVehicleWiseOrders(data) {
    let vehicle = {
      id: data.x_vehicle_id,
      regno: data.x_showveh

    }
    this.common.params = { vehicle: vehicle };
    this.modalService.open(VehicleOrders, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  callNotification(data) {
    if (data['x_mobileno']) {
      let params = {
        mobileno: data['x_mobileno'],
        callTime: this.common.dateFormatter(new Date())
      }
      this.common.loading++;
      let subcription = this.api.post('Notifications/sendCallSuggestionNotifications', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res);
          this.common.showToast(res['msg']);
          subcription.unsubscribe();
        }, err => {
          this.common.loading--;
          this.common.showError();
          console.error('callNotification:', err);
          subcription.unsubscribe();
        });
    } else {
      this.common.showError('Driver Mobile no. does not exist');
    }
  }


  getPdf() {
    this.common.downloadPdf('Content1');
  }

  handlePdfPrint() {
    let lastActive = {
      key: this.viewType,
      name: this.viewName
    };

    let statuses = ['primary', 'tripStart', 'tripEnd'];

    statuses.map(status => {
      this.viewType = this.pdfData[status].key;

      this.grouping(this.viewType);
      this.pdfData[status].chartData = Object.assign({}, this.chartData);
      this.pdfData[status].chartOptions = Object.assign({}, this.chartOptions);
      if (status == 'primary') this.pdfData[status].list = this.primaryStatus;
      else {
        this.pdfData[status].list = this.kpiGroupsKeys;
        this.pdfData[status].kpiGroups = this.kpiGroups;
      }
    });

    this.pdfData.tripStart.list.splice(5, this.pdfData.tripStart.list.length - 1);
    this.pdfData.tripEnd.list.splice(5, this.pdfData.tripEnd.list.length - 1);

    this.viewType = lastActive.key;
    this.viewName = lastActive.name;
    this.grouping(this.viewType);


  }

  generatePDF() {

    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    let subscription = this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        this.printPDF(res['data']['name']);
        subscription.unsubscribe();
      }, err => {
        this.common.loading--;
        console.error('Error:', err);
        subscription.unsubscribe();
      });
  }

  printPDF(customerName) {
    this.pdfData.tables = [];
    let data = this.pdfData.primary.list;
    const tableId = [];

    this.primaryStatus.map(status => {
      let kpis = [];
      Object.keys(status['subStatus']).map(key => {
        kpis.push(...status['subStatus'][key]);
      });
      this.pdfData.tables.push(this.setTable(kpis))
    });

    this.pdfData.tables.map((table, index) => {
      tableId.push(`print-table-${index}`);
    });

    this.pdfService.tableWithImages('page-1', tableId, data, customerName, 'Trip Feedback Logs');
  }

  cookPdfData() {
    let lastActive = {
      key: this.viewType,
      name: this.viewName
    };

    let statuses = ['primary', 'tripStart', 'tripEnd'];

    statuses.map(status => {
      this.viewType = this.pdfData[status].key;

      this.grouping(this.viewType);
      this.pdfData[status].chartData = Object.assign({}, this.chartData);
      this.pdfData[status].chartOptions = Object.assign({}, this.chartOptions);
      if (status == 'primary') this.pdfData[status].list = this.primaryStatus;
      else {
        this.pdfData[status].list = this.kpiGroupsKeys;
        this.pdfData[status].kpiGroups = this.kpiGroups;
      }
    });

    this.pdfData.tripStart.list.splice(5, this.pdfData.tripStart.list.length - 1);
    this.pdfData.tripEnd.list.splice(5, this.pdfData.tripEnd.list.length - 1);

    this.viewType = lastActive.key;
    this.viewName = lastActive.name;
    this.grouping(this.viewType);
  }

  exportCsv(tableId: string) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    let subscription = this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe((res: any) => {
        this.common.loading--;
        let details = [
          { customer: 'Customer : ' + res.data.name },
          { report: 'Report : Dashboard Trips' },
          { time: 'Time : ' + this.datePipe.transform(this.today, 'dd-MM-yyyy hh:mm:ss a') }
        ];
        this.csvService.byMultiIds([tableId], 'Dashboard', details);
        subscription.unsubscribe();
      }, err => {
        this.common.loading--;
        console.error('Err:', err);
        subscription.unsubscribe();
      });
  }

  jrxActionHandler(details: any) {
    console.log('jrxActionHandlerDetails is: ', details);
    
    if (details.heading && details.actionLevel !== 'icon') {
      switch (details.heading) {
        case 'vehicle':
          if (details.actionType === 'click')
            this.addShortTarget(this.findKPI(details.column._id.value))
          else if (details.actionType === 'dblclick')
            this.showDetails(this.findKPI(details.column._id.value))
          else if (details.actionType === 'mouseover' && this.isMapView)
            this.rotateBounce.bind(this.findKPI(details.column._id.value), details.index)
          else if (details.actionType === 'mouseout' && this.isMapView)
            this.mapService.toggleBounceMF(details.index, 2)
          break;
        case 'status':
          this.showDetails(this.findKPI(details.column._id.value));
          break;
        case 'location':
          this.showLocation(this.findKPI(details.column._id.value));
          break;
        case 'trail':
          this.getUpdate(this.findKPI(details.column._id.value));
          break;
      }
    } else if (details.actionLevel === 'icon') {
      switch (details.heading) {
        case 'icon fa fa-chart-pie':
          this.openChangeStatusModal(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-star':
          this.vehicleReport(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-route':
          this.openRouteMapper(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-truck':
          this.openTripDetails(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-globe':
          this.openVehicleStates(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-question-circle':
          this.reportIssue(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-user-secret':
          this.openStations(this.findKPI(details.column._id.value))
          break;
        case 'icon fas fa-tachometer-alt':
          this.openOdoMeter(this.findKPI(details.column._id.value))
          break;
        case 'icon fas fa-flag-checkered':
          this.openentityFlag(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-gavel':
          this.openVehicleWiseOrders(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-phone':
          this.callNotification(this.findKPI(details.column._id.value))
          break;
        case 'icon fa fa-map-marker':
          this.openStations(this.findKPI(details.column._id.value))
          break;
      }
    }
  }

  findKPI(regno) {
    return this.kpis.find((kpi) => {
      if (kpi.x_showveh == regno) return true;
      return false;
    });
  }

  getGpsStatus() {
    this.gpsStatus = _.groupBy(this.allKpis, 'x_gps_state');
    this.gpsStatusKeys = Object.keys(this.gpsStatus)
    console.log("this.gpsStatus=", this.gpsStatus);
    console.log("this.gpsStatusKeys=", this.gpsStatusKeys);
  }

  filterByGpsData(filterKey) {
    this.kpis = this.allKpis.filter(kpi => {
      if (kpi['x_gps_state'] == filterKey) {
        return true;
      }
      return false;
    });
    console.log("filterKey", this.kpis);
    this.table = this.setTable();
  }

  setIsHidePie() {
    this.isHidePie = !this.isHidePie;
    localStorage.setItem('isHidePie', this.isHidePie.toString());
  }

  jrxFiltered(vehicles) {
    this.markersWithId.forEach(marker => {
      let vehicle = vehicles.find(vehicle => vehicle._id == marker.id);
      if (vehicle && marker.marker) {
        marker.marker.setMap(this.mapService.map);
      } else if (marker.marker) {
        marker.marker.setMap(null);
      }
    });
  }

  jrxFindNearBy(kpi) {
    if (!kpi.x_tlat || !kpi.x_tlong) {
      this.common.showError('Location Not Available!');
      return;
    }

    const location = {
      lat: kpi.x_tlat,
      lng: kpi.x_tlong,
      angle: kpi.x_angle,
      name: kpi.x_showveh,
      time: ""
    };

    let locations = this.allKpis.filter(vehicle => {
      if (!vehicle.x_tlat || !vehicle.x_tlong) {
        return false;
      }

      let distance = this.common.distanceFromAToB(kpi.x_tlat, kpi.x_tlong, vehicle.x_tlat, vehicle.x_tlong, 'K');
      if (distance <= 50)
        return true;
      return false;
    }).map(vehicle => {
      return {
        lat: vehicle.x_tlat,
        lng: vehicle.x_tlong,
        name: vehicle.x_showveh,
      }
    });

    this.common.params = { location, title: "Near By Vehicles : " + kpi.x_showveh, locations };
    this.modalService.open(NearByVehiclesComponent, {
      size: "lg",
      container: "nb-layout"
    });

  }

  prefrenceModalOpen() {
    this.modalService.open(ConciseColumnPrefrenceComponent, { size: "xl", container: "nb-layout" })
  }
}
