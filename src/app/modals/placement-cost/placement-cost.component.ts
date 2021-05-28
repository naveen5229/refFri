import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'placement-cost',
  templateUrl: './placement-cost.component.html',
  styleUrls: ['./placement-cost.component.scss']
})
export class PlacementCostComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }


}
