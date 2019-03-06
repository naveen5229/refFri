import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'update-ticket-properties',
  templateUrl: './update-ticket-properties.component.html',
  styleUrls: ['./update-ticket-properties.component.scss']
})
export class UpdateTicketPropertiesComponent implements OnInit {

  properties;
  flagValue = '';
  id = '';

  ticketProperties = {
    issue_type_id:'',
    issue_name:'BD-Data Isu - Close Trip',
    esc_time:'120',
    compl_rem_time:'180',
    compl_esc_time:'900',
    is_reminder: true,
    is_escalate: true,
    is_deliverytime: true,
    is_urgent: true
    // foid:''
  };

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    if (this.common.params) {
      this.properties = this.common.params.values;
      this.flagValue = this.common.params.flag;
      this.id = this.common.params.foid;
      if(this.flagValue=='edit'){
        this.ticketProperties.is_deliverytime=this.properties.is_deliverytime;
        this.ticketProperties.is_escalate=this.properties.is_escalate;
        this.ticketProperties.is_reminder=this.properties.is_reminder;
        this.ticketProperties.is_urgent=this.properties.is_urgent;
        this.ticketProperties.issue_type_id=this.properties.issue_id;
        this.ticketProperties.esc_time=this.properties.esc_time;
        this.ticketProperties.compl_rem_time=this.properties.compl_rem_time;
        this.ticketProperties.compl_esc_time=this.properties.compl_esc_time;
        this.ticketProperties.issue_name=this.properties.issue_name;  
      }
      console.log('parmas value:properties ', this.properties);
      console.log('parmas value:flagValue ', this.flagValue);
      console.log('parmas value:id ', this.id);
    }
  }

  ngOnInit() {
  }

  dismiss(status) {
    this.activeModal.close({ status: status });
  }


  updateProperties() {

    if (this.flagValue == 'edit') {
      let params = {
        issue_type_id: this.ticketProperties.issue_type_id,
        esc_time: this.ticketProperties.esc_time,
        compl_rem_time: this.ticketProperties.compl_rem_time,
        compl_esc_time: this.ticketProperties.compl_esc_time,
        is_reminder: this.ticketProperties.is_reminder,
        is_escalate: this.ticketProperties.is_escalate,
        is_deliverytime: this.ticketProperties.is_deliverytime,
        is_urgent: this.ticketProperties.is_urgent,
        fo_issue_ticket_properties_id: this.properties.row_id,
        foid: this.id

      };
      console.log('params_update: ', params);
      this.common.loading++;
      this.api.post('FoTicketProperties/updateTicketProperties', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['msg']);
        }, err => {
          this.common.loading--;
          this.common.showError();
        });
    } else {
      let params = {
        issue_type_id: this.ticketProperties.issue_type_id,
        esc_time: this.ticketProperties.esc_time,
        compl_rem_time: this.ticketProperties.compl_rem_time,
        compl_esc_time: this.ticketProperties.compl_esc_time,
        is_reminder: this.ticketProperties.is_reminder,
        is_escalate: this.ticketProperties.is_escalate,
        is_deliverytime: this.ticketProperties.is_deliverytime,
        is_urgent: this.ticketProperties.is_urgent,
        foid: this.id

      };
      console.log('params_insert: ', params);
      this.common.loading++;
      this.api.post('FoTicketProperties/insertTicketProperties', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['msg']);
        }, err => {
          this.common.loading--;
          this.common.showError();
        });

    }
  }

}
