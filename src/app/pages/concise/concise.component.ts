import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { CommonService } from "../../services/common.service";
import { UserService } from "../../services/user.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { KpisDetailsComponent } from "../../modals/kpis-details/kpis-details.component";
import { LocationMarkerComponent } from "../../modals/location-marker/location-marker.component";
import { from } from "rxjs";
import { NbThemeService } from "@nebular/theme";
import { ImageViewComponent } from "../../modals/image-view/image-view.component";
import { slideToLeft, slideToUp } from "../../services/animation";
import * as _ from "lodash";
import { forEach } from "@angular/router/src/utils/collection";
import { log } from "util";
import { ReportIssueComponent } from "../../modals/report-issue/report-issue.component";
import { componentRefresh } from "@angular/core/src/render3/instructions";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RadioSelectionComponent } from "../../modals/radio-selection/radio-selection.component";
import { VehiclesOnMapComponent } from "../../modals/vehicles-on-map/vehicles-on-map.component";
import { VehicleReportComponent } from "../../modals/vehicle-report/vehicle-report.component";
import { RouteMapperComponent } from "../../modals/route-mapper/route-mapper.component";
import { TripDetailsComponent } from "../../modals/trip-details/trip-details.component";
import { VehicleStatesComponent } from "../../modals/vehicle-states/vehicle-states.component";
import { ResizeEvent } from "angular-resizable-element";
import { MapService } from "../../services/map.service";
import { NgxPrintModule } from 'ngx-print';
import { VehicleTripUpdateComponent } from "../../modals/vehicle-trip-update/vehicle-trip-update.component";
import { ChangeVehicleStatusComponent } from "../../modals/change-vehicle-status/change-vehicle-status.component";

@Component({
  selector: "concise",
  templateUrl: "./concise.component.html",
  styleUrls: ["./concise.component.scss", "../pages.component.css"]
  // animations: [slideToLeft(), slideToUp()],
})
export class ConciseComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  kpis = [];
  allKpis = [];
  searchTxt = "";
  filters = [];
  viewType = "showprim_status";
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
    }
  ];

  selectedFilterKey = "";

  table = null;

  primaryStatus = [];
  subPrimaryStatus = {};

  activePrimaryStatus = "";
  primarySubStatus = [];

  widths = {
    smartTable: "40%",
    map: "60%"
  };

  isMapView = false;
  infoWindow = null;
  isZoomed = false;

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public mapService: MapService
  ) {
    this.getKPIS();
    this.common.refresh = this.refresh.bind(this);
    this.common.currentPage = "";
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
  }

  ngOnDestroy() {
    this.mapService.map = null;
    this.common.continuoueScroll();
  }

  get f() {
    return this.registerForm.controls;
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
    console.log("Refresh");
    this.getKPIS();
  }

  getKPIS() {
    this.common.loading++;
    this.api.get("VehicleKpis").subscribe(
      res => {
        this.common.loading--;
        console.log(res);
        this.allKpis = res["data"];
        this.kpis = res["data"];
        this.grouping(this.viewType);
        this.table = this.setTable();
      },
      err => {
        this.common.loading--;
        console.log(err);
      }
    );
  }

  getTableColumns() {
    let columns = [];
    this.kpis.map((kpi, i) => {
      columns.push({
        vechile: {
          value: kpi.x_showveh,
          action: this.getZoom.bind(this, kpi),
          colActions: {
            dblclick: this.showDetails.bind(this, kpi),
            mouseover: this.rotateBounce.bind(this, kpi, i),
            // mouseover: this.mapService.toggleBounceMF.bind(this.mapService, i),
            mouseout: this.mapService.toggleBounceMF.bind(this.mapService, i, 2)
          }
        },
        status: {
          value: kpi.showprim_status,
          action: "",
          colActions: { dblclick: this.showDetails.bind(this, kpi) }
        },
        location: {
          value: kpi.Address,
          action: this.showLocation.bind(this, kpi)
        },
        hrs: {
          value: kpi.x_hrssince,
          action: "",
          colActions: { dblclick: this.showDetails.bind(this, kpi) }
        },
        Idle_Time: {
          value: parseFloat((kpi.x_idle_time / 60).toFixed(1)),
          action: "",
          colActions: { dblclick: this.showDetails.bind(this, kpi) }
        },
        trip: {
          value: this.getTripStatusHTMLNew(kpi),
          action: this.getUpadte.bind(this, kpi),
          isHTML: true,
          colActions: { dblclick: this.showDetails.bind(this, kpi) }
        },
        kmp: {
          value: kpi.x_kmph,
          action: "",
          colActions: { dblclick: this.showDetails.bind(this, kpi) }
        },

        action: {
          value: "",
          isHTML: false,
          action: null,
          icons: this.actionIcons(kpi)
        },

        rowActions: {
          click: "selectRow"
        }
      });
    });
    return columns;
  }

  getTripStatusHTML(kpi) {
    let html = "<div>";
    if (kpi.trip_status_type == 0) {
      html += `
      <!-- Heading -->
        <span>${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward mr-0"></i>
        <i class="ion-md-arrow-round-forward" style="margin-left:-1px;"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 1) {
      html += `
      <!-- Loading -->
        ${this.handleCircle(kpi.x_showtripstart)}
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
          ${this.handleCircle(kpi.x_showtripend)}
        `;
    } else if (kpi.trip_status_type == 4) {
      html += `
      <!-- Complete -->
        <span>${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
        <i class="fa fa-check-circle complete"></i>
      `;
    }
    // else if (kpi.trip_status_type == 5) {
    //   html += `
    //   <!-- Complete -->
    //     <span>${kpi.x_showtripstart}</span>
    //     <i class="icon ion-md-arrow-round-forward mr-0"></i>
    //     <i class="ion-md-arrow-round-forward" style="margin-left:-1px;"></i>
    //     <span>${kpi.x_showtripend}</span>
    //   `;
    // } 
    else {
      html += `
      <!-- Ambigous -->
        <span>${kpi.x_showtripstart}</span>
        <span class="icon ion-md-route-arrow">-</span>
        <span>${kpi.x_showtripend}</span>
      `;
    }
    return html + "</div>";
  }

  getTripStatusHTMLNew(kpi) {
    const colors = ['green', 'red', 'teal'];
    let html = '';
    switch (kpi.trip_status_type) {
      case 0:
        html = `
            <!-- At Origin -->
            <span class="circle loading">${kpi.x_showtripstart}</span>
            <span>-</span>
            <span class="unloading">${kpi.x_showtripend}</span>
            ${this.formatPacement(kpi.placements)}`;
        break;
      case 1:
        html = `
            <!-- At Destination -->
            <span class="loading">${kpi.x_showtripstart}</span>
            <span>-</span>
            <span class="circle unloading">${kpi.x_showtripend}</span>
            ${this.formatPacement(kpi.placements)}`;
        break;
      case 2:
        html = `
            <!-- Onward -->
            <span class="loading">${kpi.x_showtripstart}</span>
            <span>-</span>
            <span class="unloading">${kpi.x_showtripend}</span>
            ${this.formatPacement(kpi.placements)}`;
        break;
      case 3:
        html = `
            <!-- Available (Done) -->
            <span class="loading">${kpi.x_showtripstart}</span>
            <span>-</span>
            <span class="unloading">${kpi.x_showtripend}</span>
            <i class="fa fa-check-circle complete"></i>`;
        break;
      case 4:
        html = `
            <!-- Available (Next) -->
            <span class="loading">${kpi.x_showtripstart}</span>
            <span>-</span>
            <span class="unloading">${kpi.x_showtripend}</span>
            ${this.formatPacement(kpi.placements)}`;
        break;
      case 5:
        html = `
            <!-- Available (Moved) -->
            <span class="unloading">${kpi.x_showtripstart}</span>
            ${this.formatPacement(kpi.placements)}`;
        break;
      default:
        html = `
            <!-- Ambiguous -->
            <span class="loading">${kpi.x_showtripstart}</span>
            <span>-</span>
            <span class="unloading">${kpi.x_showtripend}</span>
            ${this.formatPacement(kpi.placements)}`;
        break;
    }
    // console.log('HTML:', html);
    return html;
  }

  formatPacement(placements) {
    console.log('--------------------:', placements);
    if (!placements.length) return '';
    let html = `<i class="icon ion-md-arrow-round-forward"></i>`;
    const colors = {
      11: 'loading', // Loading
      21: 'unloading', // unloading
      0: 'others' // others
    };

    placements.map((placement, index) => {
      html += `<span class="${colors[placement.type]}">${placement.name}</span>`
      if (index != placements.length - 1) {
        html += `<span>-</span>`;
      }
    });
    console.log('Html:', html);
    return html;
  }

  getViewType() {
    this.table.data.columns = this.getTableColumns();
    this.grouping(this.viewType);
  }

  grouping(viewType) {
    console.log("All ", this.allKpis);
    this.kpis = this.allKpis;
    this.kpiGroups = _.groupBy(this.allKpis, viewType);
    console.log("this.kpiGroups", this.kpiGroups);
    this.kpiGroupsKeys = Object.keys(this.kpiGroups);
    console.log("this.kpiGroupsKeys", this.kpiGroupsKeys);
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
      if (status == "No Data 12 Hr") {
        status = "Issue";
        subStatus = "12 Hr +";
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

    console.log("Status: ", this.primaryStatus);
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

    console.log(this.chartColors, this.kpiGroupsKeys);
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
      console.log(filterKey, this.viewType);
      this.kpis = this.allKpis.filter(kpi => {
        if (kpi[this.viewType] == filterKey) return true;
        return false;
      });
    }
    this.table = this.setTable();
    console.log("Column: ", this.table);
  }

  showLocation(kpi) {
    if (!kpi.x_tlat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: kpi.x_tlat,
      lng: kpi.x_tlong,
      name: "",
      time: ""
    };
    console.log("Location: ", location);
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
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
    const activeModal = this.modalService.open(KpisDetailsComponent, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.componentInstance.modalHeader = "kpisDetails";
    // activeModal.result.then(data => {
    //     this.getKPIS();
    // });
  }

  getLR(kpi) {
    this.common.loading++;
    this.api
      .post("FoDetails/getLorryDetails", { x_lr_id: kpi.x_lr_id })
      .subscribe(
        res => {
          this.common.loading--;
          this.showLR(res["data"][0]);
          console.log("data", res);
        },
        err => {
          this.common.loading--;
          console.log(err);
        }
      );
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
    console.log("image", images);
    this.common.params = { images, title: "LR Details" };
    const activeModal = this.modalService.open(ImageViewComponent, {
      size: "lg",
      container: "nb-layout"
    });
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
    this.selectedFilterKey = "";
    //this.getKPIS();
    this.filterData("All");
  }

  reportIssue(kpi) {
    console.log("Kpi:", kpi);
    this.common.params = { refPage: "db" };
    const activeModal = this.modalService.open(ReportIssueComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(
      data =>
        data.status && this.common.reportAnIssue(data.issue, kpi.x_vehicle_id)
    );
  }

  setTable() {
    return {
      data: {
        headings: {
          vechile: { title: "Vehicle Number", placeholder: "Vehicle No" },
          status: { title: "Status", placeholder: "Status" },
          location: { title: "Location", placeholder: "Location" },
          hrs: { title: "Hrs", placeholder: "Hrs " },
          Idle_Time: { title: "Idle Time", placeholder: "Idle Time" },
          trip: { title: "Trip", placeholder: "Trip" },
          kmp: { title: "Kmp", placeholder: "KMP" },
          action: { title: "Action", placeholder: "", hideSearch: true }
        },
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        count: {
          icon: "fa fa-map map-view-icon",
          action: this.handleMapView.bind(this)
        },
        tableHeight: "87vh"
      }
    };
  }

  // openVehicleOnMapModel(){

  //   const activeModel=this.modalService.open(VehiclesOnMapComponent, {size: 'lg', container: 'nb-layout', backdrop: 'static'});
  //   this.common.handleModalSize('class', 'modal-lg', '1000');
  //   activeModel.result.then(data =>{
  //    if(!data.status){

  //    }
  //   });

  // }

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
    console.log("options", options);
    // this.common.params = { options };
    // const modal = this.modalService.open(RadioSelectionComponent, { size: 'sm' });
    // modal.result.then(data => {
    //   if (data.status) {
    //     this.kpis = data.selectedOption.kpis;
    //     this.table = this.setTable();
    //   }
    // });
    this.primarySubStatus = options;
    this.activePrimaryStatus = primaryStatus.name;
    console.log(this.activePrimaryStatus);
  }

  selectSubStatus(kpis) {
    this.kpis = kpis;
    this.table = this.setTable();
  }

  vehicleReport(kpi) {
    console.log("KPis: ", kpi);

    this.common.params = {
      vehicleId: kpi.x_vehicle_id,
      vehicleRegNo: kpi.x_showveh,
      ref_page: "consView"
    };
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.modalService.open(VehicleReportComponent, {
      size: "lg",
      container: "nb-layout",
      backdrop: "static",
      windowClass: "myCustomModalClass"
    });
  }

  openRouteMapper(kpi) {
    let today, startday, fromDate;
    today = new Date();
    startday = new Date(today.setDate(today.getDate() - 2));
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
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
      // this.reloadData()
    );
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
    console.log("open Trip Details modal", this.common.params);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    const activeModal = this.modalService.open(TripDetailsComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
      // this.reloadData()
    );
  }

  vehicleOnMap() {
    console.log(" open vehicle on map modal");
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = { vehicles: this.kpis };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(VehiclesOnMapComponent, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.result.then(data => console.log("data", data));
  }

  onResizeEnd(event: ResizeEvent, type): void {
    console.log("Event: ", event);
    console.log("Element was resized", event.rectangle.width);
    this.widths[type] = event.rectangle.width + "px";
  }

  initialiseMap() {
    if (
      !this.mapService.map ||
      this.mapService.map.__gm.Z.id != "concise-view-map"
    ) {
      this.mapService.mapIntialize("concise-view-map");
    } else {
      console.log("Else------------------------------------");
      this.mapService.map.__gm.Z = document.getElementById("concise-view-map");
    }

    this.mapService.clearAll();
    for (let index = 0; index < this.kpis.length; index++) {
      // (kpi.x_idle_time / 60).toFixed(1)
      if (this.kpis[index].showprim_status == "No Data 12 Hr" || this.kpis[index].showprim_status == "Undetected" || this.kpis[index].showprim_status == "No GPS Data") {
        this.kpis[index].color = "ff0000";
      }
      else if ((this.kpis[index].x_idle_time / 60) > 0) {

        this.kpis[index].color = "00ff00";
      } else {
        this.kpis[index].color = "ffff00";
      }

    }
    setTimeout(() => {
      this.mapService.setMapType(0);
      this.mapService.createMarkers(this.kpis);
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
    console.log("-------------Map:", this.mapService.map);
    console.log(
      "-------------- Active Map Id: ",
      this.mapService.map.__gm.Z.id
    );
  }

  setEventInfo(event) {
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(
      `
      <b>Vehicle:</b>${event.x_showveh} <br>
      <span><b>Trip:</b>${this.getTripStatusHTMLNew(event)}</span> <br>
      <b>Status:</b>${event.showprim_status} <br>
      <b>Location:</b>${event.Address} <br>
      `
    );
    this.rotateBounce(event, null, false);
    this.infoWindow.setPosition(
      this.mapService.createLatLng(event.x_tlat, event.x_tlong)
    ); // or evt.latLng
    this.infoWindow.open(this.mapService.map);
    let bound = this.mapService.getMapBounds();

    // if (!((bound.lat1 + 0.001 <= event.lat && bound.lat2 - 0.001 >= event.lat) &&
    //   (bound.lng1 + 0.001 <= event.long && bound.lng2 - 0.001 >= event.long))) {
    //   this.mapService.zoomAt({ lat: event.lat, lng: event.lng }, this.zoomLevel);
    // }
  }
  unsetEventInfo() {
    this.infoWindow.close();
    this.infoWindow.opened = false;
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

  rotate = '';
  rotateBounce(kpi, i?, isToggle = true) {
    this.rotate = 'rotate(' + kpi.x_angle + 'deg)';
    console.log("rotate", this.rotate);
    if (isToggle) {
      this.mapService.toggleBounceMF(i);
    }
  }

  getUpadte(kpi) {
    console.log("kpi", kpi);
    let tripDetails = {
      id: kpi.x_trip_id,
      endName: kpi.x_showtripend,
      startName: kpi.x_showtripstart,
      startTime: kpi.x_showstarttime,
      endTime: kpi.x_showendtime,
      regno: kpi.x_showveh,
      vehicleId: kpi.x_vehicle_id,
      siteId: kpi.x_hl_site_id

    }
    // this.common.params= tripDetails;
    // const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });


    this.common.params = { tripDetils: tripDetails, ref_page: 'kpi' };
    console.log("vehicleTrip", tripDetails);
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });

  }

  getZoom(kpi) {
    if (this.isMapView, kpi) {
      console.log("isMapView------", this.isMapView, kpi);
      let latLng = this.mapService.getLatLngValue(kpi);
      console.log("latLng", latLng);
      let latLong = this.mapService.createLatLng(latLng.lat, latLng.lng)
      this.mapService.zoomAt(latLong);
      this.isZoomed = true;
    }
  }

  actionIcons(kpi) {
    let icons = [
      {
        class: "icon fa fa-info",
        action: this.vehicleReport.bind(this, kpi)
      },
      {
        class: "icon fa fa-question-circle",
        action: this.reportIssue.bind(this, kpi)
      },
      {
        class: " icon fa fa-route",
        action: this.openRouteMapper.bind(this, kpi)
      },
      {
        class: " icon fa fa-truck",
        action: this.openTripDetails.bind(this, kpi)
      },
      {
        class: "icon fa fa-bars",
        action: this.openVehicleStates.bind(this, kpi)
      },
     
    ]
    console.log("this.user._loggedInBy", this.user._loggedInBy);
    if (this.user._loggedInBy == "admin") {
      icons.push({
        class: " icon fa fa-camera",
        action: this.openChangeStatusModal.bind(this, kpi)
      });
    }
    return icons;
  }

  openChangeStatusModal(trip) {
    console.log("kpiiiiiis", trip);
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
      remark: trip.remark
    };
    this.common.ref_page = 'tsfl';

    this.common.params = VehicleStatusData;
    console.log("missing open data --", this.common.params);

    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log("after data chnage ");

    });
  }


handleCircle(location) {
   let locationArray = location.split('-');
   if (locationArray.length == 1) {
     return `<span class="circle">${location}</span>`;
   }
   let html = ``;
   for (let i = 0; i < locationArray.length; i++) {
     if (i == locationArray.length - 1) {
       html += `<span class="circle">${locationArray[i]}</span>`;
     } else {
       html += `<span>${locationArray[i]}</span><span class="location-seperator">-</span>`
     }
   }
   return html;
 }
 openVehicleStates(vlaues){
  this.common.params = {
    vehicleId: vlaues.x_vehicle_id,
    vehicleRegNo: vlaues.x_showveh
    
  };
  const activeModal = this.modalService.open(VehicleStatesComponent, {
    size: "lg",
    container: "nb-layout"
  });
 }
}
