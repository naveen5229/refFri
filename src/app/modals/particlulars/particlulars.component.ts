import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'particlulars',
  templateUrl: './particlulars.component.html',
  styleUrls: ['./particlulars.component.scss']
})
export class ParticlularsComponent implements OnInit {
  particulars = [
 {
    material:null,
    invoice:null,
    articleNo:null,
    materialValue:null,
    weight:null,
    containerNo:null,
    sealNo:null,
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

  ngOnInit() {
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
    material:null,
    invoice:null,
    articleNo:null,
    materialValue:null,
    weight:null,
    containerNo:null,
    sealNo:null,
    customField:false,
    customButton:true
  });
}
}
