import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'generic-input-type',
  templateUrl: './generic-input-type.component.html',
  styleUrls: ['./generic-input-type.component.scss']
})
export class GenericInputTypeComponent implements OnInit {
  priority=1
  title = '';
  type: 'text' | 'radio';
  data = null;
  radio1='';
  radio2='' 
  radio3=''
  btn1=''
  btn2=''

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService
  ) {
    console.log("modal Data", this.common.params.data);


    if (this.common.params.data) {
      this.data = this.common.params.data.apiData;
      this.title = this.common.params.data.title;
      this.type = this.common.params.data.type;
      this.radio1=this.common.params.data.radio1;
      this.radio2=this.common.params.data.radio2;
      this.radio3=this.common.params.data.radio3;
      this.btn1=this.common.params.data.btn1;
      this.btn2=this.common.params.data.btn2;

    }
    

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();

  }
  cancelRequest(){
    this.activeModal.close();

  }

  setValue(event){
    console.log("value:",event.target.value);
    
    this.priority=event.target.value;
    // if(value =='Fixed Rate'){
    //     remark = document.getElementById('r1').value;
    
    // }else if(value =='Variable Rate'){
    //     remark = document.getElementById('r2').value;
    
    // }else if(value =='Multi Rate'){
    //     remark = document.getElementById('r3').value;
    // }  
    
  }


  getAdvice(){const params = {
    ledgerId:null,
   priority:this.priority,
    remTime:null,   
    cmpContactId:null,
    remark:null

  }
  this.common.loading++;
  this.api.post('CommunicationLog/saveCommunicationLog', params)
    .subscribe(res => {
      this.common.loading--;
      // this.feedback = res['data'];
      // console.log('type', this.feedback);
      
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

  // getMobile(){
  //   this.common.loading++;
  //   this.api.get('FinanceRecovery/getCompanyContacts').subscribe(res => {
  //       this.common.loading--;
  //       console.log('res', res['data']);
  //       this.mobile=res['data']
  //       this.mobile=this.mobile[0].MobileNo
  //       this.common.showToast(res['msg']);
  //     }, 
  //     err => {
  //       this.common.loading--;
  //       this.common.showError();
  //      } );
  