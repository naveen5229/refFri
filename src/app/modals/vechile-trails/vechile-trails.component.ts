import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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

  ngOnDestroy(){}
ngOnInit() {
  }
  ngAfterViewInit(){
      this.common.loading++;
      this.mapService.mapIntialize('vehicleTrails');
      setTimeout(()=>{
      this.mapService.createMarkers(this.markers,true);
      this.common.loading--;
    },1000); 
  }
  closeModal() {
    this.markers=[];
    this.mapService.clearAll();
    this.activeModal.close({ location: this.markers });



  }
  

}
