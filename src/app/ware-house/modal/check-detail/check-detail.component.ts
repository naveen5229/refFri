import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'check-detail',
  templateUrl: './check-detail.component.html',
  styleUrls: ['./check-detail.component.scss']
})
export class CheckDetailComponent implements OnInit {

  constructor(public activeModal:NgbActiveModal) { }

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
