import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { Component, OnInit } from '@angular/core';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
import { ReportIssueComponent } from '../../modals/report-issue/report-issue.component';
import { UpdateTripDetailComponent } from '../../modals/update-trip-detail/update-trip-detail.component';
import { DatePipe } from '@angular/common';
import { DocumentsComponent } from '../../documents/documents.components';
import { ChangeDriverComponent } from '../../modals/DriverModals/change-driver/change-driver.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { VehicleReportComponent } from '../../modals/vehicle-report/vehicle-report.component';
import { VehicleStatesComponent } from '../../modals/vehicle-states/vehicle-states.component';
import { VehicleTripStagesComponent } from '../vehicle-trip-stages/vehicle-trip-stages.component';
import { DateService } from '../../services/date.service';
import { start } from 'repl';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { BulkVehicleNextServiceDetailComponent } from '../../modals/bulk-vehicle-next-service-detail/bulk-vehicle-next-service-detail.component';
import { PrintManifestComponent } from '../../modals/print-manifest/print-manifest.component';
import { TripSettlementComponent } from '../../modals/trip-settlement/trip-settlement.component';
@Component({
  selector: 'vehicle-trip',
  templateUrl: './vehicle-trip.component.html',
  styleUrls: ['./vehicle-trip.component.scss', '../pages.component.css'],
  providers: [DatePipe]
})
export class VehicleTripComponent implements OnInit {
  startDate = null;
  endDate = null;
  vehicleId = -1;
  vehicleRegNo = null;
  vehicleTrips = [];
  //table = null;
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public user: UserService,
    private modalService: NgbModal) {
    let today, endDay, startday;
    today = new Date();
    // endDay = new Date(today.setDate(today.getDate() - 1))
    this.endDate = new Date(today);
    //console.log('today', today);

    this.startDate = new Date(today.setDate(today.getDate() - 14))
    console.log('start and enddate', this.startDate, this.endDate);

    this.getVehicleTrips();
  }

  ngOnInit() {
  }


  getVehicleTrips() {
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
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    console.log('start & end', startDate, endDate);
    let params = "vehicleId=" + this.vehicleId +
      "&startDate=" + startDate +
      "&endDate=" + endDate;
    console.log('params', params);
    ++this.common.loading;
    this.api.get('TripsOperation/getTrips?' + params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        // this.vehicleId = -1;
        // this.vehicleTrips = res['data'];
        //this.vehicleTrips = JSON.parse(res['data']);
        this.vehicleTrips = res['data'];
        //this.table = this.setTable();
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
          this.table.data.headings['action'] = action;


          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.vehicleTrips.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        if (this.headings[j] == "Trip") {
          this.valobj[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.vehicleTrips[i]), isHTML: true, class: 'black' };

        } else {
          this.valobj[this.headings[j]] = { value: this.vehicleTrips[i][this.headings[j]], class: 'black', action: '' };
        }

        this.valobj['action'] = {
          value: '', isHTML: true, action: null, icons: [
            { class: 'fa fa-pencil-square-o  edit-btn', isHTML: `<h2>test</h2>`, action: this.update.bind(this, this.vehicleTrips[i]) },
            { class: 'fa fa-question-circle report-btn', action: this.reportIssue.bind(this, this.vehicleTrips[i]) },
            { class: " fa fa-trash remove", action: this.deleteTrip.bind(this, this.vehicleTrips[i]) },
            { class: " fa fa-route route-mapper", action: this.openRouteMapper.bind(this, this.vehicleTrips[i]) },
            { class: 'fa fa-star  vehicle-report', action: this.vehicleReport.bind(this, this.vehicleTrips[i]) },
            { class: 'fa fa-chart-bar status', action: this.vehicleStates.bind(this, this.vehicleTrips[i]) },
            { class: 'fa fa-handshake-o trip-settlement', action: this.tripSettlement.bind(this, this.vehicleTrips[i]) },

          ]
        }
        if (this.user._loggedInBy == "admin") {
          this.valobj['action'].icons.push({ class: 'fa fa-chart-pie change-status', action: this.openChangeStatusModal.bind(this, this.vehicleTrips[i]) });
        }


      }
      this.valobj['style'] = { background: this.vehicleTrips[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  searchVehicle(value) {
    this.vehicleId = value.id;
    this.vehicleRegNo = value.regno;
  }


  getUpadte(vehicleTrip) {
    if (vehicleTrip.endTime) {
      this.common.showToast("This trip cannot be updated ");
    } else {
      this.common.params = vehicleTrip;
      console.log("vehicleTrip", vehicleTrip);
      const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log("data", data.respone);

        this.getVehicleTrips();

      });
    }
  }


  openRouteMapper(trip) {
    console.log("----trip----", trip);
    let today, startday, fromDate;
    today = new Date();
    startday = new Date(today.setDate(today.getDate() - 2));
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: trip._vid,
      vehicleRegNo: trip.Vehicle,
      fromTime: trip._startdate || fromTime,
      toTime: trip._enddate || toTime
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

  openAddTripModal() {
    this.common.params = { vehId: -1 };
    //console.log("open add trip maodal", this.common.params.vehId);
    const activeModal = this.modalService.open(AddTripComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {
      this.getVehicleTrips();

    });
  }

  reportIssue(vehicleTrip) {
    this.common.params = { refPage: 'vt' };
    console.log("reportIssue", vehicleTrip);
    const activeModal = this.modalService.open(ReportIssueComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => data.status && this.common.reportAnIssue(data.issue, vehicleTrip.id));
  }
  deleteTrip(vehicleTrip) {
    console.log("deleteTrip", vehicleTrip);
    let params = {
      tripId: vehicleTrip.id
    }
    ++this.common.loading;
    this.api.post('VehicleTrips/deleteVehicleTrip', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
        this.common.showToast(res['msg']);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  update(vehicleTrip) {
    this.common.params = { vehicleTrip: vehicleTrip };
    const activeModal = this.modalService.open(UpdateTripDetailComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {
      this.getVehicleTrips();

    });
  }


  tripSettlement(row) {
    this.common.params = { row: row };
    const activeModal = this.modalService.open(TripSettlementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getVehicleTrips();
    });
  }


  openChangeDriverModal(vehicleTrip) {
    this.common.params = { vehicleId: vehicleTrip.vehicle_id, vehicleRegNo: vehicleTrip.regno };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.respone);

      // this.getVehicleTrips();

    });
  }

  vehicleReport(trip) {
    console.log("trip------", trip);
    let fromTime = trip._startdate;
    let toTime = trip._enddate;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehicleId: trip._vid, vehicleRegNo: trip.Vehicle, fromTime: fromTime, toTime: toTime };
    this.common.handleModalHeightWidth('class', 'modal-lg', '200', '1500');
    this.modalService.open(VehicleReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });

  }

  vehicleStates(trip) {
    console.log("trip------", trip);
    let fromTime = trip._startdate;
    let toTime = trip._enddate;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehicleId: trip._vid, vehicleRegNo: trip.Vehicle, fromTime: fromTime, toTime: toTime };
    this.common.openType = "modal";
    this.common.handleModalHeightWidth('class', 'modal-lg', '200', '1500');
    this.modalService.open(VehicleTripStagesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });

  }


  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Vehicle Trip";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "Customer Name::" + fodata['name'];
        let center_heading = "Report Name::" + "Vehicle Trip";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

  openChangeStatusModal(trip) {
    console.log("trip====", trip);
    let today, startday, fromDate;
    today = new Date();
    startday = new Date(today.setDate(today.getDate() - 2));
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());
    let VehicleStatusData = {
      vehicle_id: trip._vid,
      suggest: 11,
      latch_time: trip._startdate || fromTime,
      tTime: trip._enddate || toTime
    }
    console.log("VehicleStatusData", VehicleStatusData);

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });

  }


}
