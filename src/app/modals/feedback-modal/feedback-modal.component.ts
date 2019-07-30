import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ReminderComponent } from '../reminder/reminder.component';

@Component({
  selector: 'feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  time = {
  targetTime:null
  }
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
      this.ledgerId= this.common.params.ledgerId;
      console.log("id",this.ledgerId)
     }

  ngOnInit() {
  }

  closeModal(data){
    this.activeModal.close();

  }
  
  selectFoCompany(event) {
    this.foid = event.id;
    console.log("id", this.foid);


  }

  // openReminderModal() {
  //   this.common.params.title = "Target Time";
  //   this.common.params.returnData = true;

  //   const activeModal = this.modalService.open(ReminderComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     console.log("data", data);
  //     this.time.targetTime = data.date;
  //     this.time.targetTime = this.common.dateFormatter(new Date(this.time.targetTime));
  //     console.log('Date:', this.time.targetTime);

  //   });
  // }
 
  getData(){
  let TDate = this.common.dateFormatter(this.Date);

  if(this.foid == null){
   return this.common.showError("Company Id is Missing")
}
  const params = {
    ledgerId:this.ledgerId,
   priority:this.request,
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
           this.activeModal.close({data:true});
      }

    }, err => {
      this.common.loading--;

      this.common.showError();
    });
  }
}
