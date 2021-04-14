import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { stringify } from 'querystring';
import { DomSanitizer } from '@angular/platform-browser';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tip-feedback-logs',
  templateUrl: './tip-feedback-logs.component.html',
  styleUrls: ['./tip-feedback-logs.component.scss', '../pages.component.css']
})
export class TipFeedbackLogsComponent implements OnInit {
  vehicleId = null;
  startDate = null;
  endDate = null;
  activitySummary = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: '75vh'
    }
  };
  dataFormat = 'vehicle_wise';
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public user: UserService,
    private sanitizer: DomSanitizer) {

    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  ngAfterViewInit() {
    this.endDate = new Date();
    this.startDate = new Date(new Date().setDate(new Date().getDate() - 1));
  }

  refresh() {
    this.vehicleId = null;
    this.getFeedbackLogs();
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.vehicleId = vehicle.id;

  }

  getFeedbackLogs() {
    this.activitySummary = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        tableHeight: '75vh',
      }
    };

    const params = {
      vehicleId: this.vehicleId ? this.vehicleId : -1,
      startDate: this.common.dateFormatter1(this.startDate),
      endDate: this.common.dateFormatter1(this.endDate),
    }

    console.log("params:", params);
    const data = "startDate=" + params.startDate + "&pivotBy=" + this.dataFormat +
      "&endDate=" + params.endDate + "&vehicleId=" + params.vehicleId;
    this.common.loading++;

    this.api.get('tripsOperation/tripFeedbackLogs?' + data)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.activitySummary = res['data'] || [];
        console.log('activitySummary', this.activitySummary);
        if (this.activitySummary.length > 0) {
          let first_rec = this.activitySummary[0];
          console.log("first_Rec", first_rec);
          this.headings = [];
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

        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.activitySummary.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        console.log("as", this.activitySummary[i], [this.headings[j]], this.activitySummary[i][this.headings[j]])
        if (this.dataFormat == 'date_wise' && this.headings[j] == 'Date' || this.headings[j] == 'date') {
          this.valobj[this.headings[j]] = { value: this.activitySummary[i][this.headings[j]], class: '', action: '', isHTML: true };
        } else if (this.dataFormat == 'vehicle_wise' && this.headings[j] == 'Regno' || this.headings[j] == 'regno') {
          this.valobj[this.headings[j]] = { value: this.activitySummary[i][this.headings[j]], class: '', action: '', isHTML: true };
        }
        else
          this.valobj[this.headings[j]] = { value: this.getHtml(this.activitySummary[i][this.headings[j]]), class: '', action: '', isHTML: true };
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
  getHtml(text) {
    console.log("HSSSSS:", text)
    let string = '';
    text = JSON.parse(text);
    if (text && text.length > 0 && text != null) {
      let oldTrip = JSON.parse(text[0].o_trip);
      let str = text[0].n_trip ? text[0].n_trip : this.getTripHtml(oldTrip);
      let title = ' ';
      // string +='<span>'+this.common.getTripStatusHTML(oldTrip._trip_status_type,oldTrip._showtripstart, oldTrip._showtripend, oldTrip._placement_types, oldTrip._p_loc_name)+'</span><br>';
      string += '<span>' + text[0].location + '</span><br>';
      title += text[0].location + ' ';
      if (('' + text[0].state_name).search('Onward') > -1) {
        string += '<span class="black">(O)</span>';
        title += '(O)';

      } else if (('' + text[0].state_name).search('Unloading') > -1) {
        string += '<span class="green">(UL)</span>';
        title += '(UL)';
      } else if (('' + text[0].state_name).search('Loading') > -1) {
        string += '<span class="blue">(L)</span>';
        title += '(L)';
      } else if ((('' + text[0].state_name).search('No Data 12 Hr') > -1) || (('' + text[0].state_name).search('No GPS Data') > -1) || (('' + text[0].state_name).search('Undetected') > -1)) {
        string += '<span class="red">(Issue)</span>';
        title += '(Issue)';
      }
      else {
        string += '<span>(' + text[0].state_name + ')</span>';
        title += '(' + text[0].state_name + ')';

      }
      if (text[0].remarks) {
        string += '<span> - ' + text[0].remarks + '</span>';
        title += ' - ' + text[0].remarks;
      }

      string += "<br>Added on : " + text[0]['addtime'];
      title += ' Added on : ' + text[0]['addtime'];
      str = this.formatTripTitle(str, title);
      string = str + string;
    }
    return this.sanitizer.bypassSecurityTrustHtml(string);
  }

  formatTripTitle(str: string, strToAdd) {
    let stIndex = str.indexOf('<i title="');
    let endIndex = str.indexOf('"></i>>');
    let str2 = str.slice(stIndex, endIndex)
    let str3 = str2 + ' > ' + strToAdd;
    return str.replace(str2, str3);
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
        let center_heading = "Trip Feedback Logs";
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
        let center_heading = "Report:" + "Trip Feedback Logs";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

  getTripHtml(oldTrip) {
    let trip = '<span [innerHTML]=' + this.common.getTripStatusHTML(oldTrip._trip_status_type, oldTrip._showtripstart, oldTrip._showtripend, oldTrip._placement_types, oldTrip._p_loc_name)['changingThisBreaksApplicationSecurity'] + '></span><br>';
    console.log("trip", trip);
    return trip;
  }



}
