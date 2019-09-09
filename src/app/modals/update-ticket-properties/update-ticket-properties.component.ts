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
  id = null;
  foid=null;

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
    benchMark:null,
    benchMark2:null
    // foid:''
  };

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      this.common.handleModalSize('class', 'modal-lg', '980', 'px');
    if (this.common.params) {
      this.properties = this.common.params.values;
      this.flagValue = this.common.params.flag;
      this.foid=this.common.params.foid;
      //this.id = this.common.params.foid;
      //this.ticketProperties.issue_type_id = this.properties.issue_id;
      this.ticketProperties.issue_type_id=this.properties['_issue_id'];
      if (this.properties._row_id != null) {
        
        this.ticketProperties.is_deliverytime = this.properties['Is Delivery']==='✔'?true:false;
        this.ticketProperties.is_escalate = this.properties['Is Escalate']==='✔'?true:false;
        this.ticketProperties.is_reminder = this.properties['Is Reminder']==='✔'?true:false;
        this.ticketProperties.is_urgent = this.properties['Is Urgent']==='✔'?true:false;
        this.ticketProperties.esc_time = this.properties['Esc Time'];
        this.ticketProperties.compl_rem_time = this.properties['Comp Rem Time'];
        this.ticketProperties.compl_esc_time = this.properties['Com Esc Time'];
        this.ticketProperties.issue_name = this.properties['Issue Name'];
        this.ticketProperties.benchMark=this.properties['Bechmark'];
        this.ticketProperties.benchMark2=this.properties['Benchmark2'];
        console.log("BenchMark2:",this.properties["Benchmark2"]);
        this.id=this.properties['_row_id'];
        
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

  


  

  updateProperties()
  {
    let params = {
      issue_type_id: this.ticketProperties.issue_type_id,
      esc_time: this.ticketProperties.esc_time,
      compl_rem_time: this.ticketProperties.compl_rem_time,
      compl_esc_time: this.ticketProperties.compl_esc_time,
      is_reminder: this.ticketProperties.is_reminder,
      is_escalate: this.ticketProperties.is_escalate,
      is_deliverytime: this.ticketProperties.is_deliverytime,
      is_urgent: this.ticketProperties.is_urgent,
      benchmark:this.ticketProperties.benchMark,
      benchmark2:this.ticketProperties.benchMark2,
      id:this.id,
      foid: this.foid
    };
    console.log('params_insert: ', params);
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
}
