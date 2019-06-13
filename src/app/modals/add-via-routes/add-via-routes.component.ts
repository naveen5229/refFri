import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'add-via-routes',
  templateUrl: './add-via-routes.component.html',
  styleUrls: ['./add-via-routes.component.scss']
})
export class AddViaRoutesComponent implements OnInit {

  constructor(private mapService: MapService,
    private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService) {

    this.common.handleModalSize('class', 'modal-lg', '1150');
  }

  ngOnInit() {
  }
  add() {

  }


  closeModal() {
    this.activeModal.close();
  }
}
