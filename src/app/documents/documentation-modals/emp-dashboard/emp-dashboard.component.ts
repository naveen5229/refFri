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

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

    endDate = new Date();
    startDate = new Date();
  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;    
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit(){
    this.getEmpDashboard();

  }

  getDetails() {
    this.getEmpDashboard();
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
    let params = {
       x_start_date: this.common.dateFormatter(this.startDate),
        x_end_date: this.common.dateFormatter(this.endDate),
         analyticsType: this.analyticsType 
    };
    this.common.loading++;
    this.api.post('Admin/empDashboard', params)
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
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);

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
