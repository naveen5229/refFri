import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kpis-details',
  templateUrl: './kpis-details.component.html',
  styleUrls: ['./kpis-details.component.scss']
})
export class KpisDetailsComponent implements OnInit {
  kpi = null;

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) {
    this.kpi = this.common.params.kpi;
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
}
