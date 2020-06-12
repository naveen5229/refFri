import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { UserCallHistoryComponent } from '../../modals/user-call-history/user-call-history.component';

@Component({
  selector: 'user-call-summary',
  templateUrl: './user-call-summary.component.html',
  styleUrls: ['./user-call-summary.component.scss']
})
export class UserCallSummaryComponent implements OnInit {
  fromDate = this.common.dateFormatter1(new Date());
  endDate = this.common.dateFormatter1(new Date());;
  title = '';
  showTable = false;
  data = [];
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

    console.log(this.fromDate);
    console.log(this.endDate);
    this.getCallSummary();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }
  refresh() {

    this.getCallSummary();
  }

  getDate(date) {
    this.common.params = { ref_page: 'user-call-summary' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        console.log("data date:");
        console.log(data.date);
        if (date == 'startdate') {
          this.fromDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.fromDate);
        } else {
          this.endDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.endDate);
        }
      }
    });
  }

  getCallSummary() {
    this.common.loading++;
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    let stDate = this.fromDate;
    let enDate = this.endDate;
    this.api.post('Drivers/getUserCallSummary', { x_start_date: stDate, x_end_date: enDate + ' 23:59:00' })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        if (this.data == null) {
          this.data = [];
          return;
        }
        let first_rec = this.data[0];
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
    for (var i = 0; i < this.data.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (j != 0) {
          this.valobj[this.headings[j]] = {
            value: `<div style="color: black;" class="${this.data[i][this.headings[j]] ? 'blue' : 'black'}"><span>${this.data[i][this.headings[j]] || '-'}</span></div>`,
            action: this.openHistoryModel.bind(this, this.data[i],this.headings[j]), isHTML: true,
          }
        } else {
          this.valobj[this.headings[j]] = { value: this.data[i][this.headings[j]], class: 'black', action: '' };

        }
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


  openHistoryModel(data,type) {
    let endDate = this.endDate + ' 23:59:00';
    console.log("data------------------/", endDate);

    let callData = {
      vehicleId: 0,
      foAdminUserId: data._foadmusr_id,
      currentDay: this.common.dateFormatter1(this.fromDate),
      nextDay: this.common.dateFormatter(endDate),
      type : type
    }
    this.common.params = { callData: callData };
    console.log("calldatas =", this.common.params.callData);
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

}
