import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { UserCallHistoryComponent } from '../../modals/user-call-history/user-call-history.component';
import { NullInjector } from '@angular/core/src/di/injector';

@Component({
  selector: 'call-logs',
  templateUrl: './call-logs.component.html',
  styleUrls: ['./call-logs.component.scss', '../pages.component.css']
})
export class CallLogsComponent implements OnInit {
  callLogs = [];
  foAdminUserId = [];
  currentDay = null;
  nextDay = null;
  table = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    let nDay = new Date(this.common.dateFormatter1(new Date()).split(' ')[0]);
    this.currentDay = this.common.dateFormatter1(nDay);
    this.nextDay = this.common.dateFormatter1(new Date(nDay.setDate(nDay.getDate() + 1))).split(' ')[0];
    console.log('currentDay:', this.currentDay, this.nextDay);
  }

  ngOnInit() {
  }

  getDate() {
    this.common.params = { ref_page: 'call-logs' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      let nDay = new Date(this.common.dateFormatter1(data.date).split(' ')[0]);
      this.currentDay = this.common.dateFormatter1(nDay);
      this.nextDay = this.common.dateFormatter1(new Date(nDay.setDate(nDay.getDate() + 1))).split(' ')[0];
      console.log('currentDay:', this.currentDay, this.nextDay);

    });
  }
  getFoAdmin(foAdmin) {
    console.log("foAdmin", foAdmin);
    this.foAdminUserId = foAdmin.id;
  }

  getCallDetails() {
    let params = {
      foAdminUserId: this.foAdminUserId,
      currentDay: this.common.dateFormatter1(this.currentDay),
      nextDay: this.common.dateFormatter1(this.nextDay)
    }
    console.log('params:', params);

    ++this.common.loading;
    this.api.post('FoDetails/getDriverCallLogs', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
        this.callLogs = res['data'];
        this.table = this.setTable();
        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }


  setTable() {
    let headings = {
      vehicleNumber: { title: 'Vehicle Number', placeholder: 'Vehicle No' },
      driverName: { title: 'Driver Name', placeholder: 'Driver Name' },
      mobileNo: { title: 'Mobile Number', placeholder: 'Mobile Number' },
      incoming: { title: 'Incoming ', placeholder: 'Incoming' },
      outgoing: { title: 'Outgoing', placeholder: 'Outgoing' },
      total: { title: 'Total', placeholder: 'Total' },
      unanswered: { title: 'Unanswered', placeholder: 'Unanswered' },
      missed: { title: 'Missed', placeholder: 'Missed' },

    };


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

  getTableColumns() {
    let columns = [];
    this.callLogs.map(data => {


      let column = {
        vehicleNumber: { value: data.y_vehiclename },
        driverName: { value: data.y_drivername },
        mobileNo: { value: data.y_mobileno },
        incoming: { value: data.y_incomming },
        outgoing: { value: data.y_outgoing },
        total: {
          value: `<div style="color: black;" class="${data.y_total ? 'blue' : 'black'}"><span>${data.y_total || '-'}</span></div>`,
          action: this.openHistoryModel.bind(this, data), isHTML: true,
        },

        unanswered: { value: data.y_unanswered },
        missed: { value: data.y_missed },

      };

      columns.push(column);
    });
    return columns;
  }

  openHistoryModel(data) {
    let callData = {
      vehicleId: data.y_vehicle_id,
      foAdminUserId: this.foAdminUserId,
      currentDay: this.common.dateFormatter1(this.currentDay),
      nextDay: this.common.dateFormatter1(this.nextDay)

    }
    this.common.params = { callData: callData }
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    const activeModal = this.modalService.open(UserCallHistoryComponent, {
      size: "lg",
      container: "nb-layout",
    });
    activeModal.result.then(
      data => console.log("data", data)
      // this.reloadData()
    );
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
        let center_heading = "Call Logs";
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
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Call Logs";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

}
