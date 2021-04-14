import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'check-detail',
  templateUrl: './check-detail.component.html',
  styleUrls: ['./check-detail.component.scss']
})
export class CheckDetailComponent implements OnInit {

  constructor(public activeModal:NgbActiveModal) { }

  ngOnDestroy(){}
ngOnInit() {
  }


  getDelete(){

  }

  
  closeModal() {
    this.activeModal.close();
  }

  cancelRequest() {
    this.activeModal.close();
  }
}
