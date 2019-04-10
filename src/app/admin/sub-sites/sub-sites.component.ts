import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'sub-sites',
  templateUrl: './sub-sites.component.html',
  styleUrls: ['./sub-sites.component.scss','../../pages/pages.component.css']
})
export class SubSitesComponent implements OnInit {
  siteId = null;
  subSites = null;
  constructor(
   public common : CommonService,
    public api : ApiService,
    public mapService : MapService
  ) { }

  ngOnInit() {
  }

  getSubSites(){
    let params = "siteId="+this.siteId;
    this.common.loading++;
    this.api.get('SubSiteOperation/getSubSites?'+params)
            .subscribe(res =>{
              this.common.loading--;
              console.log('res: ',res);
              this.subSites=res['data'];
              this.markerCreate();
            }, err =>{
              this.common.loading--;
              this.common.showError();
            });
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
  }

  markerCreate(){
    this.mapService.createMarkers(this.subSites);
    let markerIndex = 0;
    for (const marker of this.mapService.markers) {
      let event = this.subSites[markerIndex];
      markerIndex++;
    }
  }
 
  rotateBounce(i,bounce) {
    console.log("index",i);
      this.mapService.toggleBounceMF(i,bounce);
  }

}
