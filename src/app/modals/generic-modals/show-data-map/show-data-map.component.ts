import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../../services/map.service';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'show-data-map',
  templateUrl: './show-data-map.component.html',
  styleUrls: ['./show-data-map.component.scss']
})
export class ShowDataMapComponent implements OnInit {
mapData = null;
  constructor(private modalService: NgbModal,
    private mapService: MapService,
    private apiService: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,) { 
    this.mapData = this.common.params && this.common.params.mapData ? this.common.params.mapData : null;
    console.log("mapData",this.mapData);
   
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
    if(this.mapData){
      setTimeout(() => {
      this.mapService.drawDataonMap(this.mapData);
      }, 200);
    }
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
}
