import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { FeedbackModalComponent } from '../feedback-modal/feedback-modal.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fo-user-state',
  templateUrl: './fo-user-state.component.html',
  styleUrls: ['./fo-user-state.component.scss']
})
export class FoUserStateComponent implements OnInit {

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
  foData=[];
  company=null
  ledgerId=null

  constructor( public activeModal:NgbActiveModal,
    public api:ApiService,
    public common:CommonService,
    public modalService:NgbModal) {
      this.ledgerId=this.common.params.ledgerId;
      this.getFoData();
      this.common.handleModalSize('class', 'modal-lg', '500', 'px', 1);

     }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getTableColumns(){
    let columns=[];
    this.foData.map(foDocs =>{
      this.valobj={};
      for (let i = 0; i < this.headings.length; i++) {
        // if(foDocs._is_company==true){
        // if (this.headings[i] == 'feedback') {
        //   this.valobj['feedback'] = { class: "fa fa-comments-o", action: this.showAction.bind(this )}
        // }
        // }
      
          this.valobj[this.headings[i]] = { value: foDocs[this.headings[i]], class: 'blue', action:'' };
        
      }

      columns.push(this.valobj);
    });
    return columns;
  }
    
 getFeedback(){
  console.log("id1",this.ledgerId)
  this.common.params={
    leadgerId1:this.ledgerId,
    company:this.company  
  }
  const activeModal = this.modalService.open(FeedbackModalComponent, {container: "nb-layout" });
    activeModal.result.then(data=> {
      console.log('res', data);
           this.getFoData();
    });
    }
    
  getFoData(){  
    this.foData=[];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};
  
    const params='ledgerId='+this.ledgerId;
    this.api.get("CommunicationLog/getCommLogs?"+ params).subscribe(
      res => {
        this.foData = [];
        this.foData = res['data'];
        console.log("result", res);
        this.company=this.foData[0]._is_company
        console.log("is",this.company)
        let first_rec = this.foData[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }     
        this.table.data.columns = this.getTableColumns();
      }
    );
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

}
