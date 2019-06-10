import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'toll-details',
  templateUrl: './toll-details.component.html',
  styleUrls: ['./toll-details.component.scss']
})
export class TollDetailsComponent implements OnInit {
startLoc = null;
endLoc = null ;
  constructor(
    public mapService : MapService,
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.zoomMap(5);
    this.mapService.autoSuggestion("startLoc", (place, lat, lng) => this.startLoc = place);
    this.mapService.autoSuggestion("endLoc", (place, lat, lng) => this.endLoc = place);

    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
  }
  closeModal() {
    this.activeModal.close();
  }
}
