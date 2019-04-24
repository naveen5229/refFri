import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ViewListComponent } from '../../../modals/view-list/view-list.component';

@Component({
  selector: 'emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {
  title = '';
  data = [];
  headings = [];
  analyticsType = "Employee Wise";
  valobj = {};
  startDay = '';
  currentDay = '';
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    let nDay = new Date(this.common.dateFormatter1(new Date()).split(' ')[0]);
    console.log("nday:", nDay);
    this.currentDay = this.common.dateFormatter1(nDay);
    this.startDay = this.common.dateFormatter1(new Date(nDay.setDate(nDay.getDate() - 4))).split(' ')[0];
    console.log('currentDay:', this.currentDay, this.startDay);
    this.getEmpDashboard();
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  ngOnInit() {
  }

  getDetails() {
    this.getEmpDashboard();
  }

  getDate(date) {
    this.common.params = { ref_page: 'user-call-summary' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        console.log("data date:");
        console.log(data.date);
        if (date == 'stdate') {
          this.startDay = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.startDay);
        } else {
          this.currentDay = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.currentDay);
        }
      }
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
  getEmpDashboard() {
    this.common.loading++;
    this.api.post('Admin/empDashboard', { x_start_date: this.startDay, x_end_date: this.currentDay, analyticsType: this.analyticsType })
      .subscribe(res => {
        this.common.loading--;
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
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);

        let first_rec = this.data['summary'][0];
        for (var key in first_rec) {

          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table.data.headings[key] = headerObj;

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
    for (var i = 0; i < this.data['summary'].length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        j
        if ((this.headings[j] == "wrong") && (this.analyticsType == "Halt Wise")) {
          console.log(this.headings[j], this.analyticsType);
          this.valobj[this.headings[j]] = { value: this.data['summary'][i][this.headings[j]], class: 'black', action: this.getData.bind(this, this.data['summary'][i]) };
        } else {
          this.valobj[this.headings[j]] = { value: this.data['summary'][i][this.headings[j]], class: 'black', action: '' };

        }
      }
      columns.push(this.valobj);
    }
    return columns;
  }

  openDetailsModal(wrongEntries) {
        let data = [];
        wrongEntries.map((wrongEntry, index) => {
          data.push([index, wrongEntry.regno, wrongEntry.cnt, wrongEntry.actct, wrongEntry.wuct]);
        });
        console.log(data);
        this.common.params = { title: 'Wrong Entries:', headings: ["#", "Vehicle RegNo", "Count", "Since Updated (In Minutes)", "Working User (In Last 10 Minutes)"], data };
        this.modalService.open(ViewListComponent, { size: 'lg', container: 'nb-layout' });
      }
  
  getData(details) {
    let params = {
      startDate: this.startDay,
      endDate: this.currentDay,
      aduserId: details.aduserid,
      haltTypeId: details.halt_type_id
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('admin/getWrongData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response", res);
        let data = res['data'];
        this.openDetailsModal(data)
      },
        err => {
          this.common.loading--;
          this.common.showError();

        })
  }

}
