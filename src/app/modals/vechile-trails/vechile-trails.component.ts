import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vechile-trails',
  templateUrl: './vechile-trails.component.html',
  styleUrls: ['./vechile-trails.component.scss']
})
export class VechileTrailsComponent implements OnInit {

  markers=[];
  constructor(
    public mapService : MapService,
    public common : CommonService,
    private activeModal : NgbActiveModal
  ) { 
    this.markers = this.common.params;
    console.log("markers",this.markers);
  }

  ngOnInit() {
    this.mapService.mapIntialize('vehicleTrails');
    setTimeout(()=>{
    this.mapService.createMarkers(this.markers);
  },2000) 
  }
  closeModal() {
    this.markers=[];
    this.mapService.clearAll();
    this.activeModal.close({ location: this.markers });



  }
  

}
