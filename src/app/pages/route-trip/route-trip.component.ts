import { Component, OnInit ,HostListener} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { DateService } from '../../services/date.service';
import { RoutesTimetableComponent } from '../../modals/routes-timetable/routes-timetable.component';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'route-trip',
  templateUrl: './route-trip.component.html',
  styleUrls: ['./route-trip.component.scss']
})
export class RouteTripComponent implements OnInit {
  frmDate = null;
  toDate = null;
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
  routeid = 0;
  routename='';
  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public user: UserService,
    private modalService: NgbModal
  ) { 
    let today, endDay, startday;
    today = new Date();
    // endDay = new Date(today.setDate(today.getDate() - 1))
    //console.log('today', today);

    this.toDate = new Date();
    this.frmDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    this.getRouteTrips();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {

    this.getRouteTrips();
  }

  getRouteTrips() {
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
    let frmDate = this.common.dateFormatter1(this.frmDate);
    let toDate = this.common.dateFormatter1(this.toDate);

  //   const params = {
  //     vehicleId:this.vehicleId,
  //     startDate: frmDate,
  //     routeId : this.routeid,
  //     endDate: toDate
  // };
  //   console.log('params', params);
    this.common.loading++;
    // this.api.post('TripExpenseVoucher/getRouteTrips', params)
    this.api.getJavaPortDost(8093, `getRouteTrips/${this.vehicleId}/${this.routeid}/${frmDate}/${toDate}`)
      .subscribe(res => {
        this.common.loading--;
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
        this.common.loading--;

        console.log('Err:', err);
      });
  }

  dateChange(event){
    console.log('event is: ', event)
    this.frmDate = new Date(event - 7 * 24 * 60 * 60 * 1000)
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
             { class: 'fas fa-edit  edit-btn', isHTML: `<h2>test</h2>`, action:  this.viewRouteTimeTable.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-question-circle report-btn', action: this.reportIssue.bind(this, this.vehicleTrips[i]) },
            // { class: " fa fa-trash remove", action: this.deleteTrip.bind(this, this.vehicleTrips[i]) },
            // { class: " fa fa-route route-mapper", action: this.openRouteMapper.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-star  vehicle-report', action: this.vehicleReport.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-chart-bar status', action: this.vehicleStates.bind(this, this.vehicleTrips[i]) },
            // { class: 'fa fa-handshake-o trip-settlement', action: this.tripSettlement.bind(this, this.vehicleTrips[i]) },

          ]
        }
        if (this.user._loggedInBy == "admin") {
        //  this.valobj['action'].icons.push({ class: 'fa fa-chart-pie change-status', action: this.openChangeStatusModal.bind(this, this.vehicleTrips[i]) });
        }


      }
      this.valobj['style'] = { background: this.vehicleTrips[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  viewRouteTimeTable(route) {
console.log('hello dost');
    let routeTime = {
      vehicleId: this.vehicleId,
      routeId: route.id,
      routeTimeId: 0,
      routetrip:1,
      routeFlag: false
    };
    this.common.params = { routeTime };
    const activeModal = this.modalService.open(RoutesTimetableComponent, { size: "lg", container: "nb-layout", backdrop: 'static' });
  }
  update(vehicleTrip) {
    console.log('vehicle trip',vehicleTrip);
    this.common.params = { vehicleTrip: vehicleTrip };
    // const activeModal = this.modalService.open(UpdateTripDetailComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' })
    // activeModal.result.then(data => {

    // });
  }
  
  searchVehicle(value) {
    this.vehicleId = value.id;
    this.vehicleRegNo = value.regno;
  }
    
  searchRoute(value) {
    this.routeid = value.id;
    this.routename = value.name;
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
}
