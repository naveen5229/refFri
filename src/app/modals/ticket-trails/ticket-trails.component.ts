import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ticket-trails',
  templateUrl: './ticket-trails.component.html',
  styleUrls: ['./ticket-trails.component.scss']
})
export class TicketTrailsComponent implements OnInit {
  trails = null;

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) { 
    this.trails = this.common.params.trailList;
    console.log("trails:",this.common.params.trailList);
  }

  ngOnInit() {
  }
  closeModal(){
    this.activeModal.close();
  }
}
