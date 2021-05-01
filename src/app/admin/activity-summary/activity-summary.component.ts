import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { UserActivityStatusComponent } from '../../pages/user-activity-status/user-activity-status.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'activity-summary',
  templateUrl: './activity-summary.component.html',
  styleUrls: ['./activity-summary.component.scss']
})
export class ActivitySummaryComponent implements OnInit {

  startDate = '';
  endDate = '';
  activitySummary = [];
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

  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    let today;
    today = new Date();
    this.endDate = (this.common.dateFormatter(today)).split(' ')[0];
    this.startDate = (this.common.dateFormatter(today)).split(' ')[0];
    console.log('dates ', this.endDate, this.startDate)
    this.common.refresh = this.refresh.bind(this);

   
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getSummary();
    }

  getDate(type) {

    this.common.params = { ref_page: 'trip status feedback' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });

  }

  getSummary() {
    this.activitySummary = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    const params = "startDate=" + this.startDate +
      "&endDate=" + this.endDate + " 23:59:59";
    console.log('params: ', params);
    this.common.loading++;
    this.api.get('FoDetails/getFoActivitySummary?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.activitySummary = res['data'];
        console.log('activitySummary', this.activitySummary);
        let first_rec = this.activitySummary[0];
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
        this.common.showError();
      })
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.activitySummary.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.activitySummary[i][this.headings[j]], class: 'black', action: this.openUserData.bind(this, this.activitySummary[i]) };
      }
      columns.push(this.valobj);
    }
    return columns;

  }

  openUserData(data) {
    this.common.params = {
      foid: data._idfo
    };

    this.common.openType = "modal";
    this.modalService.open(UserActivityStatusComponent, { size: 'lg', container: 'nb-layout', windowClass: "mycustomModalClass", backdrop: 'static' });
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
