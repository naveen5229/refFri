import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ConstraintsComponent } from '../constraints/constraints.component';

@Component({
  selector: 'update-ticket-properties',
  templateUrl: './update-ticket-properties.component.html',
  styleUrls: ['./update-ticket-properties.component.scss']
})
export class UpdateTicketPropertiesComponent implements OnInit {

  properties;
  flagValue = '';
  id = null;
  // foid = null;

  ticketProperties = {
    issue_type_id: '',
    issue_name: 'BD-Data Isu - Close Trip',
    esc_time: '120',
    compl_rem_time: '180',
    compl_esc_time: '900',
    is_reminder: true,
    is_escalate: true,
    is_deliverytime: true,
    is_urgent: true,
    benchMark: null,
    benchMark2: null
  };

  getProperties = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    this.common.handleModalSize('class', 'modal-lg', '1100', 'px');
    if (this.common.params) {
      this.properties = this.common.params.values;
      this.flagValue = this.common.params.flag;
      // this.foid = this.common.params.foid;
      this.ticketProperties.issue_type_id = this.properties['_issue_id'];
      this.ticketProperties.issue_name = this.properties['Issue Name'];
      if (this.flagValue === 'Edit') {
        this.ticketProperties.is_deliverytime = this.properties['Is Delivery'] === '✔' ? true : false;
        this.ticketProperties.is_escalate = this.properties['Is Escalate'] === '✔' ? true : false;
        this.ticketProperties.is_reminder = this.properties['Is Reminder'] === '✔' ? true : false;
        this.ticketProperties.is_urgent = this.properties['Is Urgent'] === '✔' ? true : false;
        this.ticketProperties.esc_time = this.properties['Esc Time'];
        this.ticketProperties.compl_rem_time = this.properties['Comp Rem Time'];
        this.ticketProperties.compl_esc_time = this.properties['Com Esc Time'];
        this.ticketProperties.issue_name = this.properties['Issue Name'];
        this.ticketProperties.benchMark = this.properties['Benchmark'];
        this.ticketProperties.benchMark2 = this.properties['Benchmark2'];
        this.id = this.properties['_row_id'];
      }
      this.getFoProperties();
    }
  }

  ngOnInit() {
  }

  dismiss(status) {
    this.activeModal.close({ status: status });
  }

  updateProperties() {
    let params = {
      issue_type_id: this.ticketProperties.issue_type_id,
      esc_time: this.ticketProperties.esc_time,
      compl_rem_time: this.ticketProperties.compl_rem_time,
      compl_esc_time: this.ticketProperties.compl_esc_time,
      is_reminder: this.ticketProperties.is_reminder,
      is_escalate: this.ticketProperties.is_escalate,
      is_deliverytime: this.ticketProperties.is_deliverytime,
      is_urgent: this.ticketProperties.is_urgent,
      benchmark: this.ticketProperties.benchMark,
      benchmark2: this.ticketProperties.benchMark2,
      id: this.id,
      // foid: this.foid
    };
    this.common.loading++;
    this.api.post('FoTicketProperties/insertTicketProperties', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data'][0]['y_msg']);
        this.common.showToast(res['data'][0]['y_msg']);
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }


  getFoProperties() {
    let params = {
      // foid: this.foid,
      foIssueTypeId: this.ticketProperties.issue_type_id,
    };
    this.common.loading++;
    this.api.post('FoTicketProperties/getFoProperties', params)
      .subscribe(res => {
        this.common.loading--;
        this.getProperties = [];
        this.getProperties = res['data'];
        if (res['data'] && res['data'].length) {
          let first_rec = this.getProperties[0];
          let headings = {};
          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
              headings[key] = headerObj;
            }
          }
          this.table.data = {
            headings: headings,
            columns: this.getTableColumns()
          };
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }


  getTableColumns() {
    let columns = [];
    this.getProperties.map(matrix => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = { class: '', icons: this.actionIcons(matrix) };
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(details) {
    let icons = [];
    icons.push(

      {
        class: "fa fa-filter ml-2",
        action: this.addIssueConstraints.bind(this, details)
      },
      {
        class: 'fa fa-trash ml-2',
        action: this.deleteProperties.bind(this, details)
      },
    );

    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  addIssueConstraints(constraint) {
    console.log("constaints", constraint);
    let constraints = {
      // foId: constraint._foid,
      issueType: constraint._issue_id,
      id: constraint._row_id,
    };
    let api = "FoTicketProperties/getFoProperties";
    let saveApi = "FoTicketProperties/insertTicketProperties";
    this.common.params = { constraints: constraints, api: api, saveApi: saveApi };
    const activeModal = this.modalService.open(ConstraintsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });

  }

  deleteProperties(properties) {
    let params = {
      // foid: properties._foid,
      id: properties._row_id
    };
    if (properties._row_id) {
      this.common.params = {
        title: 'Delete Property ',
        description: `<b>&nbsp;` + 'Are You Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FoTicketProperties/deleteFoProperties ', params)
            .subscribe(res => {
              this.common.loading--
              if (res['code'] == "1") {
                this.common.showToast([res][0]['msg']);
              }
              this.getFoProperties();

            }, err => {
              this.common.loading--;
              this.common.showError();
            })
        }
      });
    }
  }
}
