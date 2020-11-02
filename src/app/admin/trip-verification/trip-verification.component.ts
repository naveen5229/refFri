import { Component, OnInit } from '@angular/core';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TripKmRepairViewComponent } from '../../modals/trip-km-repair-view/trip-km-repair-view.component';

@Component({
  selector: 'trip-verification',
  templateUrl: './trip-verification.component.html',
  styleUrls: ['./trip-verification.component.scss']
})
export class TripVerificationComponent implements OnInit {

  startDate = null;
  endDate = null;
  vehicleId = -1;
  vehicleRegNo = null;
  status = 0;
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

    this.startDate = new Date(today.setDate(today.getDate() - 5))
    console.log('start and enddate', this.startDate, this.endDate);

    this.getVehicleTrips();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {

    this.getVehicleTrips();
  }
  getVehicleTrips() {
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
      "&status=" + this.status;
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
          this.gettingTableHeader(this.vehicleTrips);
          // let first_rec = this.vehicleTrips[0];
          // console.log("first_Rec", first_rec);

          // for (var key in first_rec) {

          //   if (key.charAt(0) != "_") {
          //     this.headings.push(key);
          //     let headerObj = { title: key, placeholder: this.formatTitle(key) };
          //     this.table.data.headings[key] = headerObj;
          //   }

          // }
          // let km = { title: 'KM', placeholder: 'KM' };
          // this.table.data.headings['km'] = km;
          // let googlekm = { title: 'Google KM', placeholder: 'Google KM' };
          // this.table.data.headings['googlekm'] = googlekm;
          // let hiskm = { title: 'Historic KM (Avg)', placeholder: 'Historic KM (Avg)' };
          // this.table.data.headings['hiskm'] = hiskm;
          // if (this.status == -2) {
          //   let status = { title: 'Status', placeholder: 'Status' };
          //   this.table.data.headings['status'] = status;
          //   let remark = { title: 'Remark', placeholder: 'Remark' };
          //   this.table.data.headings['remark'] = remark;
          // }
          // let action = { title: 'Action', placeholder: 'Action' };
          // this.table.data.headings['action'] = action;


          // this.table.data.columns = this.getTableColumns();
          // console.log("table:");
          // console.log(this.table);
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  gettingTableHeader(tableData) {

    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination:true
      }
    };

    let first_rec = tableData[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
        let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = headerObj;
      }
    }
    let km = { title: 'KM', placeholder: 'KM' };
    this.table.data.headings['km'] = km;
    let googlekm = { title: 'Google KM', placeholder: 'Google KM' };
    this.table.data.headings['googlekm'] = googlekm;
    // let hiskm = { title: 'Historic KM (Avg)', placeholder: 'Historic KM (Avg)' };
    // this.table.data.headings['hiskm'] = hiskm;
    if (this.status == -2) {
      let status = { title: 'Status', placeholder: 'Status' };
      this.table.data.headings['status'] = status;
      let remark = { title: 'Remark', placeholder: 'Remark' };
      this.table.data.headings['remark'] = remark;
    }
    let stampedby = { title: 'Stamped By', placeholder: 'Stamped By' };
    this.table.data.headings['stampedby'] = stampedby;
    let action = { title: 'Action', placeholder: 'Action' };
    this.table.data.headings['action'] = action;


    this.table.data.columns = this.getTableColumns();
   

    this.table.data.columns = this.getTableColumns();
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
      this.valobj = {
        class:'xyz'
      };
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
        this.valobj['stampedby'] = {
          value: this.vehicleTrips[i]['_actionby'], isHTML: true, action: null,
        }

        this.valobj['action'] = {
          value: '', isHTML: true, action: null,
          icons: this.actionIcons(this.vehicleTrips[i],i)
        }



      }
      if(this.vehicleTrips[i]['_class']){
        console.log('seleed');
        this.valobj['class']="selected";
      }
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
  
  actionIcons(trip,index) {
    let icons = [

      { class: 'fa fa-chart-pie change-status', action: this.openChangeStatusModal.bind(this, trip,index) },

    ];

    return icons;
  }
  searchVehicle(value) {
    this.vehicleId = value.id;
    this.vehicleRegNo = value.regno;
  }


  openChangeStatusModal(trip,index) {
    this.vehicleTrips[index]['_class']='selected';
    console.log("this.VehicleStatusAlerts[index]['_class']",this.vehicleTrips[index]);

    this.gettingTableHeader(this.vehicleTrips);
    console.log("trip====", trip);
    let today, startday, fromDate;
    today = new Date();
    startday = new Date(today.setDate(today.getDate() - 2));
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());
    let VehicleStatusData = {
      vehicle_id: trip._vid,
      regno : trip['Vehicle'],
      suggest: 11,
      latch_time: trip._startdate || fromTime,
      tTime: trip._enddate || toTime,
      tripId: trip._tripid,
      ref_page: 'tv',
      verifystatus:trip._statustype,
      tripName: this.common.getJSONTripStatusHTML(trip)
    }
    console.log("VehicleStatusData", VehicleStatusData);

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      // this.getVehicleTrips();
    });

  }



}
