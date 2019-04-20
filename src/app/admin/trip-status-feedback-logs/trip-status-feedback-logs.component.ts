import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ChangeVehicleStatusComponent } from '../../modals/change-vehicle-status/change-vehicle-status.component';

@Component({
  selector: 'trip-status-feedback-logs',
  templateUrl: './trip-status-feedback-logs.component.html',
  styleUrls: ['./trip-status-feedback-logs.component.scss','../../pages/pages.component.css']
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
    private modalService: NgbModal) {
      let today = new Date();
      this.startDate = (this.common.dateFormatter(today)).split(' ')[0];
      this.endDate=(this.common.dateFormatter(new Date(today.setDate(today.getDate() + 1)))).split(' ')[0];
      console.log('dates ',this.endDate,this.startDate)
    this.getTripLogs();
  }

  ngOnInit() {
  }

  getDate(type) {

    this.common.params={ref_page:'trip status feedback'}       
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start'){
          this.startDate='';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          let today = new Date(data.date);
          console.log('fromDate',this.startDate);
          this.endDate=(this.common.dateFormatter(new Date(today.setDate(today.getDate() + 1)))).split(' ')[0];
        }
        else{    
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate',this.endDate);
        }
      }
    });


  }

  getTripLogs(){
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
      let params = "startDate="+this.startDate+
      "&endDate="+this.endDate+ //" 23:59:00"+
      "&status="+this.status;
      console.log("params",params);
      this.api.get('TripsOperation/tripDetailsVerificationLogs?'+params)
        .subscribe(res => {
          this.common.loading--;
          this.tripLogs = res['data'][0].fn_trips_getfeedbackdata?JSON.parse(res['data'][0].fn_trips_getfeedbackdata):[];
          console.log("Trips Logs", this.tripLogs);
          let first_rec = this.tripLogs[0];
          console.log("first_Rec", first_rec);
          
          for (var key in first_rec) {
            if(key.charAt(0) != "_") {
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
    for(var i= 0; i<this.tripLogs.length; i++) {
      this.valobj = {};
      for(let j=0; j<this.headings.length; j++) {j 
        if(this.headings[j]=='Vehicle'){
          this.valobj[this.headings[j]] = {value: this.tripLogs[i][this.headings[j]], class: 'black', action:  this.openChangeStatusModal.bind(this, 'test')};
        }else
          this.valobj[this.headings[j]] = {value: this.tripLogs[i][this.headings[j]], class: 'black', action:  ''};
      }
      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  openChangeStatusModal(issue) {

    let ltime = new Date(issue.addtime);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 48));
    let latch_time = this.common.dateFormatter(subtractLTime);

    let VehicleStatusData = {
      id: issue.id,
      vehicle_id: issue.vehicle_id,
      tTime: issue.ttime,
      suggest: null,
      latch_time: issue.ltime,
      status: 2,
      remark: issue.remark
    };
     console.log("missing open data ", VehicleStatusData);
    this.common.ref_page = 'ari';

    this.common.params = VehicleStatusData;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      console.log("after data chnage ");
    
      });
    }
}
