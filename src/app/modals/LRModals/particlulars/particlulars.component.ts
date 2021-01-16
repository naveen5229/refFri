import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'particlulars',
  templateUrl: './particlulars.component.html',
  styleUrls: ['./particlulars.component.scss']
})
export class ParticlularsComponent implements OnInit {
  title = '';
  particulars = [
 {
    articleNo:null,    
    weight:null,
    otherDetail :
   {
    invoice:null,
    material:null,
    materialValue:null,
    containerNo:null,
    sealNo:null,
    customDetail:[],
   },
   customField:false,
   customButton:true
  }]
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) { 
    this.common.handleModalSize('class', 'modal-lg', '1500');
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  addField(i){
    this.particulars[i].otherDetail.customDetail.push(null);
  }


closeModal(flag) {
  if(flag){
    this.activeModal.close({ response: this.particulars });
  }
  else{
    this.activeModal.close({ response: this.particulars });
  }
}
addMore() {
  this.particulars.push({   
      articleNo:null,    
      weight:null,
      otherDetail :
     {
      invoice:null,
      material:null,
      materialValue:null,
      containerNo:null,
      sealNo:null,
      customDetail:[],
     },
     customField:false,
     customButton:true
  });
}
}
