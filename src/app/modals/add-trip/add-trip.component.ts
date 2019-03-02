import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit {

  constructor(public api: ApiService, public common: CommonService, public modalService: NgbModal, private activeModal: NgbActiveModal) {

  }

  ngOnInit() {
  }

}
