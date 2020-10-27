import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { stringify } from 'querystring';
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
    public user: UserService) {

    this.common.refresh = this.refresh.bind(this);
  }

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
    const data = "startDate=" + params.startDate +"&pivotBy="+this.dataFormat+
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
      console.log("as",this.activitySummary[i],[this.headings[j]],this.activitySummary[i][this.headings[j]])
        if (this.dataFormat=='date_wise' && this.headings[j] == 'Date' || this.headings[j] == 'date') {
          this.valobj[this.headings[j]] = { value: this.activitySummary[i][this.headings[j]], class: '', action: '', isHTML: true };
        } else  if (this.dataFormat=='vehicle_wise' && this.headings[j] == 'Regno' || this.headings[j] == 'regno') {
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
    let string = '';
    console.log("text",text);
    text = JSON.parse(text);
    console.log("text1",text);
    if (text && text.length > 0 && text != null) {
      string += '<span>' + text[0].location + '</span><br>';
      if (('' + text[0].state_name).search('Onward') > -1) {
        string += '<span class="black">(O)</span>';
      } else if (('' + text[0].state_name).search('Unloading') > -1) {
        string += '<span class="green">(UL)</span>';
      } else if (('' + text[0].state_name).search('Loading') > -1) {
        string += '<span class="blue">(L)</span>';
      } else if ((('' + text[0].state_name).search('No Data 12 Hr') > -1 )|| (('' + text[0].state_name).search('No GPS Data')  > -1) || (('' + text[0].state_name).search('Undetected')  > -1)) {
        string += '<span class="red">(Issue)</span>';
      } 
      else {
        string += '<span>(' + text[0].state_name + ')</span>';
      }
      if (text[0].remarks) {
        string += '<span> - ' + text[0].remarks + '</span>';
      }
      if (text[0].origin) {
        string += '<br><span> ' + text[0].origin + ' -> </span>';
      }
      if (text[0].destination) {
        string += '<span>' + text[0].destination + '</span>';
      }
    }
    return string;
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





}
