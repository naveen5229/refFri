import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'trip-status-feedback-logs',
  templateUrl: './trip-status-feedback-logs.component.html',
  styleUrls: ['./trip-status-feedback-logs.component.scss', '../../pages/pages.component.css']
})
export class TripStatusFeedbackLogsComponent implements OnInit {
  tripLogs = [];
  startDate = null;
  endDate = null;
  status = "-1";
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
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer ) {
    let today = new Date();
    this.startDate = (this.common.dateFormatter(today)).split(' ')[0];
    this.endDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() + 1)))).split(' ')[0];
    console.log('dates ', this.endDate, this.startDate)
    this.getTripLogs();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getTripLogs();
  }

  getDate(type) {

    this.common.params = { ref_page: 'trip status feedback log' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          let today = new Date(data.date);
          console.log('fromDate', this.startDate);
          this.endDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() + 1)))).split(' ')[0];
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });
  }

  getTripLogs() {
    this.tripLogs = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.common.loading++;
    let params = "startDate=" + this.startDate +
      "&endDate=" + this.endDate + //" 23:59:00"+
      "&status=" + this.status;
    console.log("params", params);
    this.api.get('TripsOperation/tripDetailsVerificationLogs?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.tripLogs = res['data'] ? res['data'] : [];
        console.log("Trips Logs", this.tripLogs);
        let first_rec = this.tripLogs[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }

        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.tripLogs.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        j
        if (this.headings[j] == 'Vehicle') {
          this.valobj[this.headings[j]] = { value: this.tripLogs[i][this.headings[j]], class: 'black', action: this.openChangeStatusModal.bind(this, this.tripLogs[i]) };
        } 
        else if (this.headings[j] == 'New Destination') {
          this.valobj[this.headings[j]] = { value: this.tripLogs[i][this.headings[j]], class: 'blue', action: this.openPlacementModal.bind(this, this.tripLogs[i]) };
        }
        else if (this.headings[j] == 'Trip') {
          this.valobj[this.headings[j]] = { value: this.getTripHtml(this.tripLogs[i][this.headings[j]]), class: 'blue',isHTML: true };
        }
        else if (this.headings[j] == 'Action') {
          if (this.tripLogs[i][this.headings[j]] == 0)
            this.valobj[this.headings[j]] = { value: "Action Required", class: "red", action: this.changeTripFeedbackAction.bind(this, this.tripLogs[i]) };
          else {
            this.valobj[this.headings[j]] = { value: "Done", class: 'green' };

          }
        }
        else
          this.valobj[this.headings[j]] = { value: this.tripLogs[i][this.headings[j]], class: 'black', action: '' };
        // this.valobj['style'] = { background: this.tripLogs[i][this.headings[j]] == 1 ? "#0EEC0E" : "" };

      }
      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  openChangeStatusModal(trip) {
    console.log("missing open data +++", trip);
    let ltime = new Date();
    let tTime = this.common.dateFormatter(new Date());
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);

    let VehicleStatusData = {
      id: trip.id,
      vehicle_id: trip._vid,
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



  getTripHtml(oldTrip){
    oldTrip = JSON.parse(oldTrip);
    let trip = this.common.getTripStatusHTML(oldTrip._trip_status_type,oldTrip._showtripstart, oldTrip._showtripend, oldTrip._placement_types, oldTrip._p_loc_name);
    // let trip = '<span [innerHTML]='+this.common.getTripStatusHTML(oldTrip._trip_status_type,oldTrip._showtripstart, oldTrip._showtripend, oldTrip._placement_types, oldTrip._p_loc_name)['changingThisBreaksApplicationSecurity']+'></span><br>';
    console.log("trip",trip);
    return trip;
    // return this.sanitizer.bypassSecurityTrustHtml(trip);
  }

  getVerifiedButton() {
    let html = `
    <button class="btn btn-primary m-0" (click)="checked();">Get Details</button>
    `
    return html;
  }

  openPlacementModal(trip) {
    let tripDetails = {
      vehicleId: trip._vid,
      siteId: -1

    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'trip status feedback logs' };
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }

  changeTripFeedbackAction(tripFeedback) {
    let params = {
      tripFeedbackId: tripFeedback._id
    }
    this.common.loading++;
    this.api.post('TripsOperation/changeTripFeedbackAction', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);
        if (res['code'] == 1) {
          this.getTripLogs();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
