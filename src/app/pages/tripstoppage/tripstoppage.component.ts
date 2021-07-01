import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment_ from 'moment';
const moment = moment_;
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'tripstoppage',
  templateUrl: './tripstoppage.component.html',
  styleUrls: ['./tripstoppage.component.scss']
})
export class TripstoppageComponent implements OnInit {
  tripData = [];
  tripMasterReportData = [];
  selectedVehicle = {
    id: 0
  };
  min=0;
  placeName = '';
  startTime: any;
  endTime: any;
  resultTime: any;
  duration = [];
  table = null;
  headings = [];
  valobj = {};

  startdate = new Date();
  enddate = new Date();

  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public user: UserService) {
    let today = new Date();
    this.startTime = new Date(today.setDate(today.getDate() - 1));
  }

  ngOnInit(): void {
  }

  getVehicle(vehicle) {
    console.log('test fase', vehicle);
    this.selectedVehicle = vehicle;
    console.log('test fase', this.selectedVehicle.id);
  }

  // getTripMasterReport(){

  // }

  getTripMasterReport() {
    this.tripData = [];
    const params = "startTime=" + this.common.dateFormatter(this.startdate) +
      "&endTime=" + this.common.dateFormatter(this.enddate)+"&vehid="+this.selectedVehicle.id+"&min="+this.min;
    this.common.loading++;
    this.api.get('TripsOperation/getTripStoppageReport?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.tripData = res['data'];
        if (!(res['data'].length)){
          this.common.showToast('record empty !!');
        }else{
        this.tripData.forEach((d) => {
          this.startTime = d.start_time;
          this.startTime = new Date(this.startTime);
          this.endTime = d.end_time;

          if (this.endTime != null) {
            this.endTime = new Date(this.endTime);
            this.resultTime = this.endTime - this.startTime;
            console.log('begore resultTime: ' + this.resultTime);
            var result = this.common.dateDiffInHoursAndMins(this.startTime, this.endTime);
            //var result=moment.utc(this.resultTime).format('HH:mm');
            console.log('moment', moment.utc(this.resultTime).format('HH:mm'));
            this.duration.push(result);
          } else {
            var result1 = 'Running';
            this.duration.push(result1);
          }


        });
      }
        console.log('result time', this.resultTime);
        this.table = this.setTable();
        console.log('table :', this.table);

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  setTable() {
    let headings = {
      Reg: { title: 'Reg No', placeholder: 'Reg No' },
      Start: { title: 'Start', placeholder: 'Start' },
      End: { title: 'End', placeholder: 'End' },
      Place: { title: 'Place', placeholder: 'Place' },
      Location: { title: 'Location', placeholder: 'Location' },
      // Reason: { title: 'Reason', placeholder: 'Reason' },
      Duration: { title: 'Duration', placeholder: 'Duration' },
     // Action: { title: 'Action', placeholder: 'Action' }
    };

    // if (this.user._loggedInBy == 'admin') {
    //   headings['delete'] = { title: 'Delete', placeholder: 'Delete', hideSearch: true, class: 'del' };
    // }
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
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
    let i = 0;
    this.tripData.map(R => {

      let column = {
        Reg: { value: R.vehicle_name },
        Start: { value:R.event_type=='state' ? "* "+ this.datePipe.transform(R.start_time, 'dd MMM HH:mm '):this.datePipe.transform(R.start_time, 'dd MMM HH:mm ')},
        End: { value: this.datePipe.transform(R.end_time, 'dd MMM HH:mm') },
        Place: { value: this.getPlaceName(R), class: R.halt_type_id == 11 ? 'green' : R.halt_type_id == 21 ? 'red' : 'default' },
        Location: { value: R.loc_name },
        // Reason: { value: R.halt_reason, class: R.halt_type_id == 11 ? 'green' : R.halt_type_id == 21 ? 'red' : 'default' },
        Duration: { value: R.halt_time }//{ value: this.duration[i] },
        //Action: { value: `<i class="fa fa-map-marker"></i>`, isHTML: true, action: this.showLocation.bind(this, R) },
      };
      columns.push(column);
      i++;
    });
    console.log('column',columns);
    return columns;
  }
  getPlaceName(R) {
    let str_site_name, str_halt_reason;
    if (R.site_name != null) {
      str_site_name = R.site_name.toUpperCase();
      console.log('str_site_name', str_site_name)
    }
    if (R.halt_reason != null) {
      str_halt_reason = R.halt_reason.toUpperCase();
      console.log('str_halt_reason', str_halt_reason)
    }


    if ((str_site_name == "UNKNOWN") || (R.site_name == null)) {
      if (R.site_type != null) {
        if ((str_halt_reason != "UNKNOWN")) {
          this.placeName = R.site_type + '_' + R.halt_reason;
          console.log('place:1 ', this.placeName);
        } else {
          this.placeName = R.site_type;
          console.log('place:2 ', this.placeName);
        }
      } else if ((str_halt_reason != "UNKNOWN")) {
        this.placeName = R.halt_reason;
        console.log('place:3 ', this.placeName);
      } else {
        this.placeName = 'Halt';
        console.log('place:4 ', this.placeName);
      }
    } else if ((str_halt_reason != "UNKNOWN")) {
      this.placeName = R.site_name + '_' + R.halt_reason;
      console.log('place:5 ', this.placeName);
    } else {
      this.placeName = R.site_name;
      console.log('place:6 ', this.placeName);
    }

    return this.placeName;

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
        let center_heading = "Trip Tat Report";
       // let time = "Start Date:"+this.datePipe.transform(this.startDate, 'dd-MM-yyyy')+"  End Date:"+this.datePipe.transform(this.endDate, 'dd-MM-yyyy');
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"]);
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
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Trip Profit And Loss";
       // let time = "Start Date:"+this.datePipe.transform(this.startDate, 'dd-MM-yyyy')+"  End Date:"+this.datePipe.transform(this.endDate, 'dd-MM-yyyy');
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null);
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

}

