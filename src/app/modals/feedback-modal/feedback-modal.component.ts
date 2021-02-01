import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ReminderComponent } from '../reminder/reminder.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  time = {
  targetTime:null
  }
  showContact=false
  foid=null
  feedback=[];
  request=2;
  userRemark=null;
  ledgerId=null
  Date = new Date();

  constructor(public activeModal:NgbActiveModal,
    public modalService:NgbModal,
    public common:CommonService,
    public api:ApiService) {
      this.common.handleModalSize('class', 'modal-lg', '500', 'px', 2);
      this.ledgerId= this.common.params.leadgerId1;
      console.log("paera", this.common.params.leadgerId1)
      if(this.common.params.company != false){
        this.showContact=true
      }
     }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(data){
    this.activeModal.close({id:this.ledgerId});
  }
  
  selectFoCompany(event) {
    this.foid = event.id;
    console.log("id", this.foid);
  }

  getData(){
  let TDate = this.common.dateFormatter(this.Date);
  console.log("param", this.common.params.leadgerId1)
  const params = {
    ledgerId:this.common.params.leadgerId1,
   priority:1,
    remTime:TDate,   
    cmpContactId:this.foid,
    remark:this.userRemark
  }
  this.common.loading++;
  this.api.post('CommunicationLog/saveCommunicationLog', params)
    .subscribe(res => {
      this.common.loading--;
      this.feedback = res['data'];
      console.log('type', this.feedback);
      
      if(res['msg'] == "success"){
        this.common.showToast("Successful Insert");
           this.activeModal.close({data:true,id:this.ledgerId});
      }

    }, err => {
      this.common.loading--;

      this.common.showError();
    });
  }
}
