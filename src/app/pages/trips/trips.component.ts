import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { TripKmRepairViewComponent } from '../../modals/trip-km-repair-view/trip-km-repair-view.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {

  type = '2'

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
      hideHeader: true,
      pagination: true
    }
  };
  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    let today, endDay, startday;
    today = new Date();
    // endDay = new Date(today.setDate(today.getDate() - 1))
    this.endDate = new Date(today);
    //console.log('today', today);

    this.startDate = new Date(today.setDate(today.getDate() - 14))
    console.log('start and enddate', this.startDate, this.endDate);

    this.getVehicleTrips(this.type);
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {

    this.getVehicleTrips(this.type);
  }
  getVehicleTrips(type) {
    this.type = type;
    this.vehicleTrips = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      }
    };
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    console.log('start & end', startDate, endDate);
    let params = "vehicleId=" + this.vehicleId +
      "&startDate=" + startDate +
      "&endDate=" + endDate +
      "&status=" + this.type;
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
          let km = { title: 'KM', placeholder: 'KM' };
          this.table.data.headings['km'] = km;
          // let googlekm = { title: 'Google KM', placeholder: 'Google KM' };
          // this.table.data.headings['googlekm'] = googlekm;
          // let hiskm = { title: 'Historic KM (Avg)', placeholder: 'Historic KM (Avg)' };
          // this.table.data.headings['hiskm'] = hiskm;
          if (this.type == '-2') {
            let status = { title: 'Status', placeholder: 'Status' };
            this.table.data.headings['status'] = status;
            let remark = { title: 'Remark', placeholder: 'Remark' };
            this.table.data.headings['remark'] = remark;
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
        this.valobj['km'] = { value: this.vehicleTrips[i]['_km'], class: 'blue',action:this.openTripKmRepair.bind(this, this.vehicleTrips[i]) };
        
        this.valobj['googlekm'] = {
          value: this.vehicleTrips[i]['_googlekm'], isHTML: true, action: null,
        }
        this.valobj['hiskm'] = {
          value: this.vehicleTrips[i]['_hiskm'], isHTML: true, action: null,
        }
        this.valobj['remark'] = {
          value: this.vehicleTrips[i]['_remark'], isHTML: true, action: null,
        }
        this.valobj['status'] = {
          value: this.vehicleTrips[i]['_statusname'], isHTML: true, action: null,
        }
        this.valobj['action'] = {
          value: '', isHTML: true, action: null,
          icons: this.actionIcons(this.vehicleTrips[i])
        }



      }
      this.valobj['style'] = { background: this.vehicleTrips[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  openTripKmRepair(tripInfo){
    if(!tripInfo['_km']){
      this.common.showError('No Data');
      return;
    }
    let tripData = {
      tripId : tripInfo['Trip Id']
    };
    this.common.params = tripData;
    console.log("tripData", this.common.params);

    const activeModal = this.modalService.open(TripKmRepairViewComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      // this.getVehicleTrips();
    });
  }

  actionIcons(trip) {
    let icons = [
      { class: " fa fa-route route-mapper", action: this.openRouteMapper.bind(this, trip) },
      { class: 'fa fa-question-circle  change-status', action: this.openRemarkModal.bind(this, trip) },

    ];

    return icons;
  }
  searchVehicle(value) {
    this.vehicleId = value.id;
    this.vehicleRegNo = value.regno;
  }

  openRemarkModal(trip) {
    this.common.params = { remark: null, title: 'Add Objection ' }
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        let remark = data.remark;
        this.tripStampped(remark, trip._tripid)
      }
    });
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

  tripStampped(remark, tripId) {
    console.log("this.tripId", tripId);
    let params = {
      tripId: tripId,
      status: -2,
      remark: remark
    };
    ++this.common.loading;
    this.api.post('HaltOperations/tripVerification', params)
      .subscribe(res => {
        --this.common.loading;
        this.common.showToast(res['data'][0].y_msg);
        this.getVehicleTrips(this.type);
      }, err => {
        --this.common.loading;

      });
  }
}
