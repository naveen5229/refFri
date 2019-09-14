import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ViewListComponent } from '../../../modals/view-list/view-list.component';
import { LocationMarkerComponent } from '../../../modals/location-marker/location-marker.component';

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
    let nDay = new Date();
    this.startDay = this.common.dateFormatter(nDay);
    this.currentDay = this.startDay
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
        console.log(data.date);
        if (date == 'stdate') {
          this.startDay = this.common.dateFormatter(data.date);
        } else {
          this.currentDay = this.common.dateFormatter(data.date);
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
    let startDay = new Date(this.startDay);
    let x_start_date = this.common.dateFormatter(new Date(startDay)).split(' ')[0]
    let currentDay = new Date(this.currentDay);
    let x_end_date = this.common.dateFormatter(new Date(currentDay.setDate(currentDay.getDate() + 1))).split(' ')[0]
    this.common.loading++;
    this.api.post('Admin/empDashboard', { x_start_date: x_start_date, x_end_date: x_end_date, analyticsType: this.analyticsType })
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
        let first_rec = this.data['summary'][0];
        for (var key in first_rec) {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table.data.headings[key] = headerObj;
        }
        this.table.data.columns = this.getTableColumns();
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
          this.valobj[this.headings[j]] = { value: this.data['summary'][i][this.headings[j]], class: 'black', action: this.getData.bind(this, this.data['summary'][i]) };
        } else {
          this.valobj[this.headings[j]] = { value: this.data['summary'][i][this.headings[j]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    }
    return columns;
  }


  getData(details) {
    let startDay = new Date(this.startDay);
    let startDate = this.common.dateFormatter(new Date(startDay)).split(' ')[0]
    let currentDay = new Date(this.currentDay);
    let endDate = this.common.dateFormatter(new Date(currentDay.setDate(currentDay.getDate() + 1))).split(' ')[0]

    let params = {
      startDate: startDate,
      endDate: endDate,
      aduserId: details.aduserid,
      haltTypeId: details.halt_type_id
    };
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

  openDetailsModal(wrongEntries) {
    let data = [];
    let actionParams = {
      'Site Name': []
    };
    wrongEntries.map((wrongEntry, index) => {
      data.push([index, wrongEntry.id, wrongEntry.fo_name, wrongEntry.site_name, wrongEntry.halt_type, wrongEntry.wrong_by, wrongEntry.corrected_by, wrongEntry.cleartime]);
      actionParams['Site Name'].push(wrongEntry);
    });
    let actions = {
      'Site Name': this.openLocationModal.bind(this)
    };
    this.common.params = { title: 'Wrong Entries:', actions, actionParams, headings: ["#", "Halt Id", "Fo Name", "Site Name", "Halt Type", "Wrong BY", "Correct By", "Clear Time"], data };
    this.modalService.open(ViewListComponent, { size: 'lg', container: 'nb-layout' });
  }

  openLocationModal(site) {
    if (!site.lat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: site.lat,
      lng: site.long,
      name: "",
      time: ""
    };
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }
}
