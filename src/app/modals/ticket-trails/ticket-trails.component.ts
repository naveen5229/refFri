import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ticket-trails',
  templateUrl: './ticket-trails.component.html',
  styleUrls: ['./ticket-trails.component.scss']
})
export class TicketTrailsComponent implements OnInit {
  title = '';
  headings = [];
  datas = [];

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.headings = this.common.params.headings;
    this.datas = this.common.params.data;
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
}
